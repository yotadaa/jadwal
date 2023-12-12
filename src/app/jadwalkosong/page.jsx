'use client';
import { useContext, useEffect, useState } from "react";
import AppContext from "../api/context/AppContext";
import { getValue, getWaktu } from "../api/context/functionality";

export default function Home() {

    function minutesToHHmm(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(remainingMinutes).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}`;
    }

    const context = useContext(AppContext);
    const minuteList = Array.from({ length: 1440 }, (_, index) => index); // 1440 minutes in a day

    const getMinutes = (time) => {
        const [hours, minutes] = time.split(' ').map(t => parseInt(t));
        return hours * 60 + minutes;
    }

    const isMinuteFree = (minute) => {
        return !context.jadwal.some(schedule => {
            const startTime = getMinutes(schedule.mulai);
            const endTime = getMinutes(schedule.selesai);
            return minute >= startTime && minute < endTime && context.currentDay === schedule.hari;
        });
    };

    const [freeTimeBlocks, setFreeTimeBlocks] = useState([]);

    const groupFreeMinutes = (freeMinutes) => {
        const grouped = [];
        let start = null, end = null;

        for (let i = 0; i < freeMinutes.length; i++) {
            if (start === null) {
                start = freeMinutes[i];
            }
            end = freeMinutes[i];

            if (freeMinutes[i + 1] !== freeMinutes[i] + 1) {
                grouped.push({ start, end });
                start = null;
            }
        }

        return grouped;
    };

    useEffect(() => {
        const favoriteCount = context.jadwal.reduce((acc, jadwalItem) => {
            return acc + (jadwalItem.favorite && jadwalItem.hari === context.currentDay ? 1 : 0);
        }, 0);
        context.setCountFavorite(favoriteCount);
        const freeMinutes = minuteList.filter(isMinuteFree);
        setFreeTimeBlocks(groupFreeMinutes(freeMinutes));
    }, [context.jadwal, context.currentDay])


    return (
        <div>
            <div className='flex flex-col items-center justify-center p-5 pl-3 pt-0 pb-0 ml-2'>
                <div className='p-3 rounded-xl font-extrabold flex justify-start items-center w-full bg-white m-5 shadow-xl'>
                    Jadwal kosongmu
                </div>
            </div >
            {freeTimeBlocks.map(block => (
                <div key={block.start} className='flex justify-between gap-1 w-full items-center mb-2 px-3'>
                    <div
                        className={`dialog-item flex items-center justify-between bg-emerald-300 w-full rounded-lg shadow-xl hover:opacity-80 cursor-pointer select-none overflow-x-clip`}
                        onClick={(ev) => {
                        }}
                    >
                        <div className="p-2 w-1/2 font-bold overflow-x-ellipsis" style={{ whiteSpace: 'nowrap' }}>
                            Kamu kosong dari {minutesToHHmm(block.start)} hingga {minutesToHHmm(block.end)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
