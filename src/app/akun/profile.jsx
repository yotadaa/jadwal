import { useContext, useState, useEffect } from "react";
import AppContext from "../api/context/AppContext";
import ProcessingAnimation from '../components/processing';
import Notification from '../components/notification';
import { decodeToken, storeValue } from "../api/context/functionality";
// import { relog } from "../api/context/functionality";

export default function Profile(props) {
    const { showProfile, setShowProfile } = props.visible;
    const context = useContext(AppContext);
    const [choosenPic, setChoosenPic] = useState("");
    const [showProcessing, setShowProcessing] = useState(false);

    const relog = async () => {
        try {
            const res = await fetch("../api/mongos/users", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: context.user.email,
                    password: context.user.password,
                    todo: "relog"
                }),
            });

            const data = await res.json()
            if (data.success) {
                storeValue('login', data.success);
                storeValue('login-token', data.token);
                context.setUser(decodeToken());
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

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

    const gantiProfile = async () => {
        try {
            setShowProcessing(true)
            const res = await fetch("../api/mongos/users", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: context.user.email,
                    profile: choosenPic,
                    todo: "ganti-profile"
                }),
            });
            const data = await res.json();
            console.log(data);
            if (data.success) {
                // insertNotif("Berhasil mengubah profile!", !data.success);
                relog();
            }
        } catch (error) {
            // insertNotif(error, true)
            console.log(error);
        }
        setShowProcessing(false);
        setShowProfile(false);
    }

    useEffect(() => {
        setChoosenPic(context.user.profile);
    }, [context.user.profile])


    return (
        <div className={`${showProfile ? "flex" : "hidden"} flex justify-center items-center fixed w-screen h-screen top-0 left-0`}
            style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                zIndex: 99999
            }}
        >
            <div className="bg-white rounded-md shadow-lg"
                style={{
                    width: 600,
                    height: 400,
                    flexWrap: "wrap",
                }}
            >
                <div className="flex items-center justify-center mt-2 text-lg font-bold">
                    <h1>Pilih Foto</h1>
                </div>
                <div className="flex gap-5 flex-wrap p-5 justify-center items-center">
                    {context.profilePicture.map((item, index) => {
                        return (
                            <div
                                key={index}
                            // classname={`border-2`}
                            >
                                <img
                                    className={`hover:shadow-xl rounded-full ${choosenPic === item.name ? "shadow-xl border-4 border-blue-500" : ""}`}
                                    src={item.href}
                                    width={110}
                                    onClick={() => {
                                        setChoosenPic(item.name)
                                    }}
                                />
                            </div>

                        )
                    })}
                </div>
                <div className="mt-5 w-full flex items-center justify-center">
                    <div className="px-5 py-1 bg-emerald-300 rounded-full text-lg font-bold select-none cursor-pointer hover:opacity-80"
                        onClick={() => {
                            gantiProfile();
                        }}
                    >
                        Konfirmasi
                    </div>
                </div>
            </div>
            <div className={`${showProcessing ? "block" : 'hidden'}`}>
                <ProcessingAnimation />
            </div>
            {/* <div className={`${notif.length > 0 ? "block" : "hidden"}`}>
                {notif.map((item, index) => {
                    return (
                        <Notification message={item.message} danger={item.danger} key={index} />
                    )
                })}
            </div> */}
        </div>
    )
}