import { NextResponse } from "next/server";
import { connectDB } from '../connectDB';
import Tugas from '../../../models/tugas.model';
import User from "@/app/models/user.model";
// import { getCurrentDateTime } from "../../context/functionality";

const getCurrentDateTime = () => {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `${day}${month}${year}${hours}${minutes}${seconds}${milliseconds}`;
};

export async function POST(req) {
    const date = new Date();
    console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
    try {
        await connectDB();
        const requestBody = await req.json();
        const { todo } = requestBody;

        if (todo === "get") {
            const { email } = requestBody;
            const tugas = await Tugas.find({
                email: email
            });
            // console.log(tugas)
            return NextResponse.json({ success: true, data: tugas });
        } else if (todo === 'import-task') {
            const { email, id } = requestBody;
            // console.log(email, id);
            const user = await User.findOne({ uniqueId: id });
            const currentUser = await User.findOne({ email: email });
            // console.log(id, currentUser.uniqueId);
            if (id === currentUser.uniqueId) {
                return NextResponse.json({ success: false, err: "Gunakan id temanmu!" })
            } else if (currentUser.sharedTugas.includes(id)) {
                return NextResponse.json({ success: false, err: "List sudah ada" })
            } else if (!user) {
                return NextResponse.json({ success: false, err: 'Kode unik tidak valid' });
            } else {
                await User.findOneAndUpdate(
                    { email: email },
                    { $addToSet: { sharedTugas: id } },
                    { upsert: true }
                );
                return NextResponse.json({ success: true, name: user.firstName });
            }
        } else if (todo === "get-friends") {
            const { email } = requestBody;
            const user = await User.findOne({ email: email });
            if (!user) {
                return NextResponse.json({ success: false, message: 'User tidak ditemukan' });
            }
            var friendLists = [];
            for (var i = 0; i < user.sharedTugas.length; i++) {
                const getUser = await User.findOne({ uniqueId: user.sharedTugas[i] });
                friendLists.push({ name: getUser.firstName, id: getUser.uniqueId, email: getUser.email, profile: getUser.profile });
            }
            // console.log(friendLists)
            return NextResponse.json({ success: true, message: 'Oke', list: friendLists });
        } else if (todo === "add-from-friends") {
            const { email, task } = requestBody;
            const theId = getCurrentDateTime();
            // console.log(email, task.id, theId)
            const newTask = new Tugas({
                id: theId,
                judul: task.judul,
                deadline: task.deadline,
                deskripsi: task.deskripsi,
                email: email
            });

            try {
                await newTask.save();
                return NextResponse.json({ success: true, err: "" });
            } catch (err) {
                console.log(err);
                return NextResponse.json({ success: false, err: err["_message"] });
            }
        } else if (todo === "add") {
            const { judul, deskripsi, deadline, email } = requestBody;
            const newTask = new Tugas({
                id: getCurrentDateTime(),
                judul: judul,
                deadline: deadline,
                deskripsi: deskripsi,
                email: email
            })

            try {
                await newTask.save();
                return NextResponse.json({ success: true, message: "Tugas berhasil ditambahkan!" })
            } catch (err) {
                console.log(err);
                return NextResponse.json({ success: false, err: "Gagal menambahkan tugas!" });
            }
        } else if (todo === "delete") {
            const { id } = requestBody;
            await Tugas.findOneAndDelete({ id: id });
            return NextResponse.json({ success: true, message: "Your tugas successfully deleted" });
        } else if (todo === "update") {
            const { id, judul, deskripsi, deadline } = requestBody;
            const task = await Tugas.findOneAndUpdate(
                { id: id },
                {
                    $set: {
                        judul: judul,
                        deadline: deadline,
                        deskripsi: deskripsi
                    }
                },
            )
            if (!task) {
                return NextResponse.json({ success: false, err: "Gagal mengubah tugas!" });
            }
            return NextResponse.json({ success: true, message: "Berhasil mengubah tugas!" });
        }

    } catch (err) {
        console.log("unexpected error " + err);
        return NextResponse.json({ success: false, err: err });
    }
}