import { useContext, useState, useEffect } from "react";
import AppContext from "../api/context/AppContext";
import ProcessingAnimation from "../components/processing";
import Notification from '../components/notification';

export default function GetTask(props) {
    const context = useContext(AppContext);
    const { showGetTask, setShowGetTask } = props.component;
    const [code, setCode] = useState("");
    const [showProcessing, setShowProcessing] = useState(false);

    const [notif, setNotif] = useState([]);

    const insertNotif = (message, danger) => {
        setNotif((prevNotif) => [...prevNotif, {
            message: message,
            danger: danger
        }]);
    };

    useEffect(() => {
        if (notif.length > 0) {
            const timerId = setTimeout(() => {
                setNotif([]);
            }, 1000);

            return () => {
                clearTimeout(timerId);
            };
        }
    }, [notif]);

    const importTask = async () => {
        try {
            setShowProcessing(true);
            const res = await fetch("../api/mongos/tugas", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: context.user.email,
                    id: code,
                    todo: "import-task",
                }),
            });
            const data = await res.json();
            if (data.success) {
                insertNotif("Berhasil menambahkan", !data.success);
                context.initialFriends();
                setShowGetTask(false);
            } else {
                insertNotif(data.err, !data.success);
            }
        } catch (error) {
            // insertNotif(error, true)
            console.log(error);
        } finally {
            setShowProcessing(false);
        }
    };




    return (
        <div className={`${showGetTask ? "flex" : "hidden"} fixed w-screen h-screen top-0 left-0 items-center justify-center`}
            style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
            }}
        >
            <div
                className="bg-white mb-20 rounded-lg shadow-xl p-5 flex flex-col items-center justify-between"
                style={{
                    width: 400,
                    height: 200
                }}
            >
                <div className="font-bold">Masukkan kode dari temanmu!</div>
                <input
                    className="bg-gray-300 w-full rounded-full text-center py-1 focus:outline-none"
                    type='text'
                    placeholder="Masukkan kode"
                    value={code}
                    onChange={(event) => {
                        setCode(event.target.value)
                    }}
                />
                <div className="flex items-center justify-between w-full px-14">
                    <div
                        className="w-20 py-1 bg-emerald-300 text-center cursor-pointer hover:opacity-80 rounded-sm"
                        onClick={() => {
                            if (code.length > 0) {
                                importTask();
                            } else {
                                insertNotif("Field harus diisi!", true);
                            }
                        }}
                    >
                        Tambah!
                    </div>
                    <div
                        className="w-20 py-1 bg-emerald-300 text-center cursor-pointer hover:opacity-80 rounded-sm"
                        onClick={() => {
                            setShowGetTask(false);
                            setCode('')
                        }}
                    >Batal</div>
                </div>
            </div>
            <div className={`${showProcessing ? "block" : 'hidden'}`}>
                <ProcessingAnimation />
            </div>
            <div className={`${notif.length > 0 ? "block" : "hidden"}`}>
                {notif.map((item, index) => {
                    return (
                        <Notification message={item.message} danger={item.danger} key={index} />
                    )
                })}
            </div>
        </div>
    )
}