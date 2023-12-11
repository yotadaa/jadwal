'use client'
import { useContext, useEffect, useState } from "react";
import Search from "../components/search";
import AppContext from "../api/context/AppContext";
import { getWaktu, epochToFormattedDatetime } from "../api/context/functionality";
import ProcessingAnimation from "../components/processing";
import JadwalForm from "../lihatjadwal/jadwal-form";
import TaskAdd from "../tugas/task-form";

export default function searchPage() {
    const [isHover, setIsHover] = useState(false);
    const context = useContext(AppContext);
    const [query, setQuery] = useState("");
    const [currentItem, setCurrentItem] = useState({});
    const [forEdit, setForEdit] = useState({})
    const [displayImport, setDisplayImport] = useState(-1);
    const [isInit, setIsInit] = useState(true);
    const styling = "flex items-center gap-3";
    const [showTugas, setShowTugas] = useState(true);
    const [showJadwal, setShowJadwal] = useState(true);
    const [currentTugas, setCurrentTugas] = useState({});
    const [showJadwalForm, setShowJadwalForm] = useState(false);
    const [showTaskAdd, setShowTaskAdd] = useState(false);

    useEffect(() => {
        context.setRightBar(<div></div>)
        context.setShowCari(false);
        context.setCurrentMenu(-1);
    }, [])

    useEffect(() => {
        if (context.user) {
            context.getJadwal();
            context.getTugas(context.user.email);
        }
    }, [context.user])

    return (
        <div className="relative p-2">
            <div className=" bg-white p-2 shadow-lg rounded-md "
            >
                <div
                    className="flex justify-between gap-2 items-center "
                >
                    <input placeholder="Cari sesuatu..." className="focus:bg-gray-100 focus:outline-none p-2 rounded-md"
                        style={{
                            width: 400
                        }}
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                        }}
                    />
                    <div class={`${isHover ? "hover-round" : ""} `}>
                        <img
                            src="assets/search.png"
                            width="25"
                            class="p-2 w-10 cursor-pointer rounded-full"
                            onMouseEnter={() => {
                                setIsHover(true)
                            }}
                            onMouseLeave={() => {
                                setIsHover(false)
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center p-5 pl-1 pt-0 pb-0 ml-2'>
                <div className='cursor-pointer p-3 rounded-xl font-extrabold flex items-center w-full bg-white m-5 mb-1 shadow-xl justify-between'
                    onClick={() => {
                        setShowJadwal(!showJadwal)
                    }}
                >
                    <div>Jadwal</div> <div>[{showJadwal ? "Tutup" : "Tampilkan"}]</div>
                </div>
                {context.jadwal && context.jadwal.map((item, index) => {
                    if (
                        (item.judul.toLowerCase().includes(query.toLowerCase()) ||
                            item.deskripsi.toLowerCase().includes(query.toLowerCase()) ||
                            context.daftarHari[item.hari].toLowerCase().includes(query.toLowerCase()) ||
                            item.lokasi.toLowerCase().includes(query.toLowerCase())
                        ) && query.length > 0
                    ) {
                        if (context.refDay[index].current) context.refDay[indexes].current.style.display = "flex"
                        return (
                            <div
                                className={`${showJadwal ? "flex" : "hidden"} items-center justify-between gap-2`}
                                key={index}
                                onMouseEnter={() => {
                                    setDisplayImport(index);
                                    setForEdit(item);
                                    console.log(context.currentTugasMenu, displayImport)
                                }}
                                onMouseLeave={() => {
                                    setDisplayImport(-1);
                                }}
                            >
                                <div
                                    key={index}
                                    className={`dialog-item items-center justify-start bg-emerald-100 w-full h-11 rounded-lg shadow-xl mb-2 hover:opacity-80 cursor-pointer select-none flex`}
                                    onClick={(ev) => {
                                        // ev.preventDefault();
                                        ev.stopPropagation();
                                        setCurrentItem(item);
                                        setIsInit(false);
                                    }}
                                >
                                    <div className="p-2 flex justify-center items-center w-20 h-11 shadow-md bg-emerald-300 rounded-l-lg overflow-hidden">
                                        <div>{getWaktu(item.mulai)[0]} : {getWaktu(item.mulai)[1]}</div>
                                    </div>
                                    <div className="p-2 w-20 h-11 flex justify-center items-center bg-emerald-200 shadow-md overflow-hidden">
                                        <div>{getWaktu(item.selesai)[0]} : {getWaktu(item.selesai)[1]}</div>
                                    </div>
                                    <div
                                        className={`p-2 h-11 ${displayImport === index ? "w-44" : "w-72"} font-bold overflow-hidden`}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        <div className={`w-72 animate-text ${displayImport === index ? 'animate-right-to-left' : ''}`}>
                                            {item.judul}
                                        </div>
                                    </div>
                                </div>

                                <div className={`${displayImport === index ? "block" : "hidden"} shadow-xl rounded-full cursor-pointer hover:opacity-80 select-none bg-white p-1`}
                                    onDoubleClick={() => {
                                        setShowJadwalForm(true)
                                    }}
                                    onClick={() => {
                                        setForEdit(item);
                                    }}
                                >
                                    <img
                                        src='assets/pencil.png'
                                        width={30}
                                        className='p-1'
                                    />
                                </div>

                                <div className={`${displayImport === index ? "block" : "hidden"} shadow-xl rounded-full cursor-pointer hover:opacity-80 select-none`}
                                    onDoubleClick={() => {
                                        removeItem(item.id)
                                    }}
                                >
                                    <img
                                        src='assets/trash.png'
                                        width={30}
                                        className='shadow-xl'
                                    />
                                </div>
                                <div className={`${displayImport === index ? "block" : "hidden"} rounded-full cursor-pointer hover:opacity-80 select-none`}
                                    onDoubleClick={() => {
                                        updateFav(item.id);
                                    }}
                                >
                                    <img
                                        src={`assets/${item.favorite ? 'star' : 'paporit'}.png`}
                                        width={35}
                                        className=''
                                    />
                                </div>
                            </div>
                        )
                    }
                })}
            </div>

            <div className='flex flex-col items-center justify-center p-5 pl-1 pt-0 pb-0 ml-2'>
                <div className='cursor-pointer p-3 rounded-xl font-extrabold flex items-center w-full bg-white m-5 mb-1 shadow-xl justify-between'
                    onClick={() => {
                        setShowTugas(!showTugas)
                    }}
                >
                    <div>Tugas</div> <div>[{showTugas ? "Tutup" : "Tampilkan"}]</div>
                </div>
                {context.tugas && context.tugas.map((item, index) => {
                    if (
                        (item.judul.toLowerCase().includes(query.toLowerCase()) ||
                            item.deskripsi.toLowerCase().includes(query.toLowerCase())) &&
                        query.length > 0
                    ) return (
                        <div key={index} className="flex gap-2 w-full">
                            <div className='flex justify-between gap-1 w-full items-center mb-2'
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
                                        setCurrentTugas(item);
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
                                        setCurrentTugas(item);
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
                                        removeItem(item.id)
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
                        </div>
                    )
                })}
            </div>

            <div className={`${Object.keys(currentItem).length > 0 ? "flex" : (!isInit) ? "animate-down-s hidden" : "hidden"} container-popup fixed bottom-0`}
                style={{
                    width: 500,
                    height: 250
                }}
            >

                <div
                    className={`popup-dialog custom-scrollbar bg-gray-50 rounded-t-3xl flex flex-col`}
                    style={{
                        height: 500
                    }}
                >
                    <div
                        className={`${Object.keys(currentItem).length > 0 ? "opacity-100" : "opacity-0"}`}
                    >
                        <img
                            src='assets/close.png'
                            width={25}
                            className='absolute select-none cursor-pointer hover:opacity-80 top-2 right-2'

                            onClick={() => {
                                setCurrentItem({})
                            }}
                        />
                        <div className='flex items-center justify-center mt-6 font-extrabold text-xl text-center p-2'>{currentItem.judul}</div>
                        <div
                            className='p-5 '
                        >
                            <div className={`p-2 mt-3`}>
                                <div className={`font-bold text-xl ` + styling}><img src="assets/cal.png" width={20} />{context.daftarHari[currentItem.hari]}</div>
                            </div>

                            <div className='hover:scale-105 cursor-pointer font-bold text-xl py-1 px-2 rounded-full bg-red-400 flex justify-between'>
                                <div className={styling}><img src="assets/clock.png" width={20} /> Waktu</div>
                                <div>{getWaktu(currentItem.mulai || "")[0]}:{getWaktu(currentItem.mulai || "")[1]} - {getWaktu(currentItem.selesai || "")[0]}:{getWaktu(currentItem.selesai || "")[1]}</div>
                            </div>

                            <div className={`p-2`}>
                                <div className={`font-bold text-xl ` + styling}><img src="assets/loc.png" width={20} />Lokasi</div>
                                <div className='text-base'>{currentItem.lokasi}</div>
                            </div>

                            <div className={`p-2`}>
                                <div className={`font-bold text-xl ` + styling}><img src="assets/description.png" width={20} />Deskripsi</div>
                                <div className='text-base'>{currentItem.deskripsi}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${Object.keys(currentTugas).length > 0 ? "flex" : "animate-down"} container-popup fixed bottom-0`}
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
                            setCurrentTugas({})
                        }}
                    />
                    <div className='flex items-center justify-center mt-10 font-bold text-lg'>{currentTugas.judul}</div>
                    <div
                        className='p-5 '
                    >
                        <div className='hover:scale-105 cursor-pointer font-bold text-xl py-1 px-2 rounded-full bg-red-400 flex justify-between'>
                            <div className={styling}><img src="assets/clock.png" width={20} /> Waktu</div>
                            <div>{epochToFormattedDatetime(currentTugas.deadline)}</div>
                        </div>

                        <div className='p-2 mt-3'>
                            <div className={`font-bold text-xl ` + styling}><img src="assets/description.png" width={20} />Deskripsi</div>
                            <div className='text-base'>{currentTugas.deskripsi}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${context.showProcessing ? "block" : 'hidden'}`}>
                <ProcessingAnimation />
            </div>
            <JadwalForm component={{ showJadwalForm, setShowJadwalForm }} edit={true} task={forEdit} />
            <TaskAdd component={{ showTaskAdd, setShowTaskAdd, }} edit={true} task={currentTugas} />
        </div>
    )
}