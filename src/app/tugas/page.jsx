// 'Page.js' on the client side
'use client'
import { useEffect, useContext, useState } from 'react';
import Master from '../components/master.jsx';
import AppContext from '../api/context/AppContext';
import TugasBar from '../components/tugasBar';
import ProcessingAnimation from '../components/processing';
import { decodeToken, epochToFormattedDatetime, getValue } from '../api/context/functionality';
import Share from './share'
import { useRouter } from 'next/navigation';
import TaskAdd from './task-form';

export default function Page() {

    const router = useRouter();

    const context = useContext(AppContext);
    const [showProcessing, setShowProcessing] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    const [displayImport, setDisplayImport] = useState(-1);
    const [tugas, setTugas] = useState([]);
    const [showTaskAdd, setShowTaskAdd] = useState(false);
    const styling = "flex items-center gap-3"

    const addFromFriends = async (task) => {
        try {
            setShowProcessing(true);
            const res = await fetch("../api/mongos/tugas", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: context.user.email,
                    task: task,
                    todo: "add-from-friends",
                }),
            });

            const data = await res.json();
            if (data.success) {
            } else {
                console.error("Error fetching tugas:", data.error);
            }
        } catch (err) {
            console.error("Error fetching tugas:", err);
        } finally {
            setShowProcessing(false); // Only hide the processing animation once the try-catch block is complete
        }
    }

    const getTugas = async () => {
        try {
            setShowProcessing(true);
            const res = await fetch("../api/mongos/tugas", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: context.user.email,
                    todo: "get",
                }),
            });

            const data = await res.json();
            if (data.success) {
                context.setTugas(data.data);
                console.log(data.success);
            } else {
                console.error("Error fetching jadwal:", data.error);
            }
        } catch (err) {
            console.error("Error fetching jadwal:", err);
        } finally {
            setShowProcessing(false); // Only hide the processing animation once the try-catch block is complete
        }
    };

    const getClosest = (ev, arr) => {
        let state = false;
        for (var i = 0; i < arr.length; i++) {
            state = state || ev.target.closest(arr[i]);
        }

        return state;
    }

    const removeItem = async (id) => {
        try {
            setShowProcessing(true);
            const res = await fetch("../api/mongos/tugas", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    todo: "delete",
                }),
            });

            const data = await res.json();
            if (data.success) {
                getTugas();
            } else {
                console.error("Error fetching jadwal12:", data.error);
            }
        } catch (err) {
            console.error("Error fetching jadwal2:", err);
        } finally {
            setShowProcessing(false); // Only hide the processing animation once the try-catch block is complete
        }
    }

    const cancelAllDialog = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        // const isClickInsideDialog = ev.target.closest('.dialog-item') || ev.target.closest('.popup-dialog');

        const isClickInsideDialog = getClosest(ev, [
            ".dialog-item",
            ".container-popup",
            ".popup-dialog",
            ".fixed-container"
        ]);

        if (!isClickInsideDialog) {
            setCurrentItem({});
        }
    }

    useEffect(() => {
    }, []);

    useEffect(() => {
        if (Object.keys(currentItem).length > 0) {
            context.setPaddingTugas(300);
        } else {
            context.setPaddingTugas(50);
        }
    }, [currentItem]);

    useEffect(() => {
        context.setCurrentTugasMenu(-1);
    }, [])


    useEffect(() => {
        setTugas(context.tugas);
        console.log(context.tugas);
        context.setRightBar(<TugasBar />)
    }, [context.tugas]);


    if (context.isLogin) return (
        <div
        >
            <div className='flex flex-col items-center justify-center p-5 pl-3 pt-0 pb-0 ml-2'>
                <div className='p-3 rounded-xl font-extrabold flex justify-start items-center w-full bg-white m-5'>
                    {context.currentTugasMenu === -1 ? "Kamu" : <span className="text-amber-500">{context.friendName}&nbsp;</span>} {context.tugas.length > 0 ? `punya ${context.tugas.length}` : "tidak punya"} tugas
                </div>
            </div >
            <div className='flex flex-col items-center justify-center p-5 pl-3 pt-0 border-l-2 border-dashed pb-0 ml-2 border-gray-500'>
                {context.tugas && tugas.map((item, index) => {
                    return (
                        <div key={index} className='flex justify-between gap-1 w-full items-center mb-2'
                            onMouseEnter={() => {
                                setDisplayImport(index);
                                console.log(context.currentTugasMenu, displayImport)
                            }}
                            onMouseLeave={() => {
                                setDisplayImport(-1);
                            }}
                        >
                            <div
                                className={`dialog-item flex items-center justify-between bg-emerald-300 w-full rounded-lg shadow-xl hover:opacity-80 cursor-pointer select-none overflow-x-clip`}
                                onClick={(ev) => {
                                    // ev.preventDefault();
                                    ev.stopPropagation();
                                    setCurrentItem(item);
                                }}
                            >
                                <div className="p-2 w-1/2 font-bold overflow-x-ellipsis" style={{ whiteSpace: 'nowrap' }}>
                                    {item.judul}
                                </div>
                                <div className="p-2 w-1/2 flex items-end justify-end text-right bg-emerald-200 rounded-r-lg">
                                    <p>{epochToFormattedDatetime(item.deadline)}</p>
                                </div>
                            </div>

                            <div className={`${context.currentTugasMenu === -1 && displayImport === index ? "block" : "hidden"} shadow-xl rounded-full cursor-pointer hover:opacity-80 select-none bg-white p-1`}
                                onDoubleClick={() => {
                                    setCurrentItem(item);
                                    setShowTaskAdd(true);
                                }}
                            >
                                <img
                                    src='assets/pencil.png'
                                    width={30}
                                    className='p-1'
                                />
                            </div>

                            <div className={`${context.currentTugasMenu === -1 && displayImport === index ? "block" : "hidden"} shadow-xl rounded-full cursor-pointer hover:opacity-80 select-none`}
                                onDoubleClick={() => {
                                    removeItem(item.id);
                                    setCurrentItem({})
                                }}
                            >
                                <img
                                    src='assets/trash.png'
                                    width={30}
                                    className='shadow-xl'
                                />
                            </div>
                            <div className={`${context.currentTugasMenu > -1 && displayImport === index ? "block" : "hidden"} shadow-lg bg-gray-100 rounded-full p-2 cursor-pointer hover:opacity-80 select-none`}
                                onDoubleClick={() => {
                                    addFromFriends(item);
                                }}
                            >
                                <img
                                    src='assets/receive-mail.png'
                                    width={20}
                                    className=''
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={`${Object.keys(currentItem).length > 0 ? "flex" : "animate-down"} container-popup fixed bottom-0`}
                style={{
                    width: 500,
                    height: 350
                }}
            >
                <div
                    className={`popup-dialog bg-gray-50 rounded-t-3xl flex flex-col`}
                >
                    <img
                        src='assets/close.png'
                        width={25}
                        className='absolute select-none cursor-pointer hover:opacity-80 top-2 right-2'
                        onClick={() => {
                            setCurrentItem({})
                        }}
                    />
                    <div className='flex items-center justify-center mt-10 font-bold text-lg'>{currentItem.judul}</div>
                    <div
                        className='p-5 '
                    >
                        <div className='hover:scale-105 cursor-pointer font-bold text-xl py-1 px-2 rounded-full bg-red-400 flex justify-between'>
                            <div className={styling}><img src="assets/clock.png" width={20} /> Waktu</div>
                            <div>{epochToFormattedDatetime(currentItem.deadline)}</div>
                        </div>

                        <div className='p-2 mt-3'>
                            <div className={`font-bold text-xl ` + styling}><img src="assets/description.png" width={20} />Deskripsi</div>
                            <div className='text-base'>{currentItem.deskripsi}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${showProcessing || context.isProcessing ? "block" : 'hidden'}`}>
                <ProcessingAnimation />
            </div>

            <TaskAdd component={{ showTaskAdd, setShowTaskAdd, }} edit={true} task={currentItem} />
        </div >
    );
    else {
        // useEffect(() => router.push(context.currentLink), []);
        return <div></div>
    }
}
