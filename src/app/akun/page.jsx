'use client';

import { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import from 'next/router'
import { decodeToken, getValue, storeValue } from '../api/context/functionality';
import AppContext from '../api/context/AppContext';
import Settings from './settings';
import ProcessingAnimation from '../components/processing';
import FriendBar from '../components/friendBar';
import Notification from '../components/notification';
import Menu from "../components/left-bar"
// import LogoutConfirmation from '../components/logout-dialog';

export default function Home() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [modifyNama, setModifyNama] = useState(true);
    const [modifyPassword, setModifyPassword] = useState(true);
    const [passwordConfirmation, setPasswordConfirmation] = useState(false);
    const [pc, spc] = useState("");
    const [showProcessing, setShowProcessing] = useState(false);
    const context = useContext(AppContext);
    const [initialShow, setInitialShow] = useState(false);
    const { firstName, email } = context.user;
    const [nama, setNama] = useState(context.user.firstName);


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

    const [showSettings, setShowSettings] = useState(false);
    const profilePicture = [
        { name: "male1", href: "assets/male1.png" },
        { name: "male2", href: "assets/male2.png" },
        { name: "male3", href: "assets/male3.png" },
        { name: "male4", href: "assets/male4.png" },
        { name: "female1", href: "assets/female1.png" },
        { name: "female2", href: "assets/female2.png" },
        { name: "female3", href: "assets/female3.png" },
        { name: "female4", href: "assets/female4.png" },
    ];

    const styleCounter = 'w-full bg-gray-100 p-1 rounded-full px-5 font-bold shadow-md';
    const inputContainer = 'flex justify-center items-center flex-row gap-3';

    const relog = async () => {
        try {
            const res = await fetch("../api/mongos/users", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
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

    const gantiPassword = async () => {
        try {
            setShowProcessing(true)
            const res = await fetch("../api/mongos/users", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    passwordLama: pc,
                    password: password,
                    todo: "ganti-password"
                }),
            });
            const data = await res.json();
            if (data.success) {
                insertNotif("Berhasil mengubah password!", false);
                spc("");
                setPassword("");
                setPasswordConfirmation(false);
            } else if (!data.success) {
                insertNotif(data.err, true);
            }
        } catch (error) {
        }
        setShowProcessing(false);
    }

    const gantiName = async () => {
        try {
            setShowProcessing(true)
            const res = await fetch("../api/mongos/users", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    username: nama,
                    todo: "ganti-nama"
                }),
            });
            const data = await res.json();
            console.log(data);
            if (data.success) {
                insertNotif("Berhasil mengubah nama!", !data.success);
                relog();
            }
        } catch (error) {
            insertNotif(error, true)
        }
        setShowProcessing(false);
    }

    const getDepedencies = async () => {
        try {
            setShowProcessing(true);

            // Assuming these functions return promises or are asynchronous
            await context.getTugas(context.user.email);
            await context.getJadwal();
        } catch (err) {
            console.log(err);
        } finally {
            setShowProcessing(false);
        }
    };


    useEffect(() => {
        // if (!context.user)
        // getDepedencies();
        context.setCurrentMenu(4)
    }, [])

    useEffect(() => {
        context.setLeftBar(<Menu />)
        context.setRightBar(<FriendBar />)
        if (!context.isLogin) {
            router.push("/login");
        }
    }, []); // Add isLogin and user to the dependency array

    if (context.isLogin) return (
        <div
        >
            <div className='p-1 bg-emerald-200 shadow-md relative rounded-xl mt-5'
            >
                <div className='text-lg relative font-bold w-full flex justify-end mt-4'>
                    <div className='flex'>
                        <div className={`select-none xl px-4 py-1 rounded-full text-black`}>AKUN</div>
                        <div className='flex items-center pr-5'>
                            <img
                                src="assets/settings.png"
                                width={20}
                                className='cursor-pointer select-none settings'
                                onClick={() => { setShowSettings(!showSettings); }}
                            />
                        </div>
                    </div>
                    <div className={`${showSettings ? "block" : "hidden"} absolute font-thin text-xs right-5 top-10`}>
                        <Settings />
                    </div>
                </div>
                <div className='flex justify-between'>
                    <div className='flex justify-start items-center gap-5 p-8 pt-5 w-full   '>
                        <div>
                            {context.user && context.profilePicture.map((item, index) => {
                                if (context.user.profile === item.name) return (
                                    <div>
                                        <img src={item.href}
                                            width={80}
                                            className='border-2 border-black rounded-full hover:opacity-80 shadow-md select-none cursor-pointer'
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        <div>
                            <div className='text-xl font-bold'>{context.user.firstName || ""}</div>
                            <div className=''>{email}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='p-5'>
                <h1 className='px-4 mb-1 font-semibold'>Counter</h1>
                <div className={styleCounter}> {context.jadwal.length} JADWAL</div>
                <div className={styleCounter + " mt-5"}> {context.tugas.length} TUGAS</div>
            </div>
            <div className='p-3'>
                <div className='border-b-2 border-black border-dashed'></div>
            </div>
            <div>
                <div className='flex items-center font-bold justify-center'>
                    <h1>EDIT PROFILE</h1>
                </div>
                <div className='p-5'>
                    <div className={inputContainer}>
                        <input
                            value={nama}
                            placeholder='Username baru'
                            onChange={(event) => {
                                setNama(event.target.value);
                            }}
                            className={styleCounter + " focus:outline-none font-thin mt-0 pt-0"}
                            disabled={modifyNama}
                        />
                        <img src='assets/pen.png'
                            width={25}
                            className={`${modifyNama ? "opacity-70" : "opacity-100"} p-0 mt-0 shadow-md cursor-pointer select-none rounded-full`}
                            onClick={(event) => {
                                setModifyNama(!modifyNama);
                                if (!modifyNama && nama !== user.firstName) {
                                    gantiName();
                                } else if (!modifyNama && nama === user.firstName) {
                                    insertNotif("Pilih nama yang berbeda!", true);
                                }
                            }}
                        />
                    </div>
                    <div className={inputContainer + " mt-4"}>
                        <input
                            value={password}
                            placeholder='Password baru'
                            type='password'
                            onChange={(event) => {
                                setPassword(event.target.value);
                            }}
                            className={styleCounter + " focus:outline-none font-thin"}
                            disabled={modifyPassword}
                        />
                        <img src='assets/pen.png'
                            width={25}
                            className={`${modifyPassword ? "opacity-70" : "opacity-100"} p-0 mt-0 shadow-md cursor-pointer select-none rounded-full`}
                            onClick={(event) => {
                                setModifyPassword(!modifyPassword);
                                if (!modifyPassword && password.length > 0) {
                                    console.log(event.target.value);
                                    setPasswordConfirmation(true);
                                } else if (!modifyPassword && password.length == 0) {
                                    insertNotif("Field tidak boleh kosong", true);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={`${passwordConfirmation ? "block" : "hidden"} flex items-center justify-center fixed w-screen h-screen top-0 left-0`}
                style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                }}
            >
                <div className='relative bg-white p-2 flex flex-col items-center justify-center rounded-md'
                    style={{
                        width: 350,
                        height: 150,
                    }}
                >
                    <div className='absolute top-2 right-2 '>
                        <img src='assets/close.png' width={20}
                            onClick={() => {
                                setPasswordConfirmation(false);
                                spc("");
                            }}
                        />
                    </div>
                    <div>
                        <h1>Masukkan password lama anda</h1>
                    </div>
                    <div className='mt-1'>
                        <input
                            value={pc}
                            placeholder='Password lama'
                            type='password'
                            onChange={(event) => {
                                spc(event.target.value);
                            }}
                            className={styleCounter + " focus:outline-none font-thin"}
                        />
                    </div>
                    <div className='bg-emerald-300 px-5 mt-5 select-none cursor-pointer hover:opacity-80 py-1 rounded-full '
                        onClick={() => {
                            gantiPassword();
                        }}
                    >
                        Konfirmasi
                    </div>
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
    );
}
