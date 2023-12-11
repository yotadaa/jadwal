import { NextResponse } from "next/server";
import { connectDB } from '../connectDB';
import Jadwal from '../../../models/jadwal.model';

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
    const expires = '1y';
    try {
        await connectDB();
        const requestBody = await req.json();
        const { todo } = requestBody;

        if (todo === "get") {
            const { email } = requestBody;
            const jadwal = await Jadwal.find({
                email: email
            });
            return NextResponse.json({ success: true, data: jadwal });
        } else if (todo === "add") {
            const { judul, deskripsi, hari, mulai, selesai, lokasi, email } = requestBody;
            const newJadwal = new Jadwal({
                id: getCurrentDateTime(),
                judul: judul,
                deskripsi: deskripsi,
                hari: hari,
                mulai: mulai,
                selesai: selesai,
                lokasi: lokasi,
                email: email,
                repeat: 0,
                favorite: false
            })

            try {
                await newJadwal.save();
                return NextResponse.json({ success: true, message: "Jadwal berhasil ditambahkan!" })
            } catch (err) {
                console.log(err);
                return NextResponse.json({ success: false, err: "Gagal menambahkan jadwal!" });
            }
        } else if (todo === "delete") {
            const { id } = requestBody;
            await Jadwal.findOneAndDelete({ id: id });
            return NextResponse.json({ success: true, message: "Your jadwal successfully deleted" });

            return NextResponse.json({ success: false, err: 'Terjadi error' });
        } else if (todo === "update") {
            const { id, judul, deskripsi, hari, mulai, selesai, lokasi } = requestBody;
            const jadwal = await Jadwal.findOneAndUpdate(
                { id: id },
                {
                    $set: {
                        judul: judul,
                        deskripsi: deskripsi,
                        hari: hari,
                        mulai: mulai,
                        selesai: selesai,
                        lokasi: lokasi,
                    }
                },
            )
            if (!jadwal) {
                return NextResponse.json({ success: false, err: "Gagal mengubah jadwal!" });
            }
            return NextResponse.json({ success: true, message: "Berhasil mengubah jadwal!" });
        } else if (todo === "favorite") {
            const { id, favorite } = requestBody;
            const jadwal = await Jadwal.findOneAndUpdate(
                { id: id },
                {
                    $set: {
                        favorite: !favorite,
                    }
                }
            )
            if (!jadwal) {
                console.log("Error ??")
                return NextResponse.json({ success: false, err: "Gagal mengupdate jadwal!" });
            }
            return NextResponse.json({ success: true, message: "Berhasil mengupdate jadwal!" });
        }
    } catch (err) {
        console.log("unexpected error " + err);
        return NextResponse.json({ success: false, err: err });
    }
}