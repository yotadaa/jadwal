'use client'

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import AppContext from '../api/context/AppContext';
import { getValue, storeValue } from '../api/context/functionality';
import JadwalBar from './jadwalBar';
import TugasBar from './tugasBar';
import FriendBar from './friendBar';
import { Link } from 'next/link';
import ProcessingAnimation from './processing';

export default function Menu() {
    const context = useContext(AppContext);
    const router = useRouter();

    return (
        <div className='p-2'>
            <div className='font-bold mt-2 p-2 rounded-lg text-sm flex items-center justify-start py-3 '>
                MENU
            </div>
            {context.menuItem.map((item, index) => {
                return (
                    <div key={index} className={`hover:bg-emerald-300 hover:font-bold ${context.currentMenu === index ? "bg-emerald-300" : "bg-white"} mt-2 p-2 rounded-lg text-xs flex items-center py-3 gap-3 shadow-lg cursor-pointer select-none hover:opacity-80`}
                        onClick={() => {
                            context.setShowCari(true)
                            context.setCurrentMenu(index);
                            storeValue("current-menu", index);
                            router.push(item.target);
                            context.setCurrentLink(item.target);
                            context.setPaddingTugas(0);
                            if (index === 3) {
                                try {
                                    context.setShowProcessing(true)
                                    context.setRightBar(<TugasBar />)
                                    // context.getTugas(context.user.email);
                                    context.setFriendName(context.user.firstName)
                                    context.setCurrentTugasMenu(-1)
                                } catch (err) {

                                } finally {
                                    context.setShowProcessing(false)
                                }
                            }
                            else if (index === 4 && index !== context.currentMenu) {
                                context.setRightBar(<div></div>)
                                context.getTugas(context.user.email);
                            }
                            else {
                                const favoriteCount = context.jadwal.reduce((acc, jadwalItem) => {
                                    return acc + (jadwalItem.favorite && jadwalItem.hari === context.currentDay ? 1 : 0);
                                }, 0);
                                context.setCountFavorite(favoriteCount);
                                context.setRightBar(<JadwalBar />)
                            }
                        }}>
                        <div><img alt={item.name.split(" ").join("-")} src={item.href} width={25} className='shadow-md rounded-full' /></div>
                        <div
                            className={` font-bold`}
                        >
                            {item.name}
                        </div>
                    </div>
                )
            })}
            <div className={`${context.showProcessing ? "block" : 'hidden'}`}>
                <ProcessingAnimation />
            </div>
        </div>
    )
}