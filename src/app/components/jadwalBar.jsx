import { useContext, useEffect, useState } from "react"
import AppContext from "../api/context/AppContext";
import { storeValue } from "../api/context/functionality";
import JadwalForm from "../lihatjadwal/jadwal-form"
import Search from "./search";

export default function JadwalBar() {

    const [pathName, setPathName] = useState("");
    const context = useContext(AppContext);
    const [showJadwalForm, setShowJadwalForm] = useState(false);

    const daftarHari = [
        "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"
    ]

    useEffect(() => {
        setPathName(window.location.pathname);
        console.log("The path name: ", pathName);
    }, [pathName])

    return (
        <div className='p-2'>
            {context.showCari ? <Search /> : <div></div>}
            <div className='font-semibold bg-white shadow-xl mt-2 p-2 rounded-lg text-xs flex items-center justify-start py-3 px-3 gap-2'>
                <div>
                    {context.user && context.profilePicture.map((item, index) => {
                        if (context.user.profile === item.name) return (
                            <div key={index}>
                                <img src={item.href}
                                    width={60}
                                    className='rounded-full hover:opacity-80 shadow-md select-none cursor-pointer'
                                />
                            </div>
                        )
                    })}
                </div>
                <div>
                    <div className='text-base font-semibold'>{context.user.firstName || ""}</div>
                </div>
            </div>
            {daftarHari.map((item, index) => {
                return (
                    <div
                        key={index}
                        className={`select-none cursor-pointer ${context.currentDay === index ? "bg-emerald-300" : "bg-white"} mt-2 p-2 rounded-lg text-xs flex items-center justify-start py-3 shadow-md px-3`}
                        onClick={() => {
                            context.setShowItemJadwal(Array.from({ length: 24 }, () => {
                                return { shown: true }
                            }));
                            // context.setCountFavorite(0);
                            context.setCurrentDay(index);
                            const favoriteCount = context.jadwal.reduce((acc, jadwalItem) => {
                                return acc + (jadwalItem.favorite && jadwalItem.hari === index ? 1 : 0);
                            }, 0);
                            context.setCountFavorite(favoriteCount);
                            storeValue("current-day", index);
                            for (var i = 0; i < context.refDay.length; i++) {
                                if (context.refDay[i].current) {
                                    context.refDay[i].current.style.display = "none"
                                }
                            }
                        }}
                    >
                        {item}
                    </div>
                )
            })}
            <div className='bg-blue-300 hover:font-bold mt-2 p-2 rounded-lg text-xs flex items-center justify-start py-3 gap-3 shadow-lg cursor-pointer select-none hover:opacity-80'
                onClick={() => {
                    setShowJadwalForm(true);
                }}
            >
                <img
                    src='assets/plus.png'
                    width={20}
                />
                <div>Tambah Jadwal</div>
            </div>
            <JadwalForm component={{ showJadwalForm, setShowJadwalForm }} />
        </div>
    )
}