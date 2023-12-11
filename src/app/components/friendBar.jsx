'use client'

import { useEffect, useState, useContext } from 'react';
import AppContext from '../api/context/AppContext';
import Search from './search';

export default function Menu() {
    const context = useContext(AppContext);

    return (
        <div className='p-2 mt-3'>

            {context.showCari ? <Search /> : <div></div>}
            <div className='font-semibold bg-emerald-300 mt-2 p-2 rounded-lg text-xs flex items-center justify-start py-3 shadow-md'>
                Daftar Teman
            </div>
            {context?.friendList.map((item, index) => {
                return (
                    <div key={index} className='select-none cursor-pointer bg-white mt-2 p-2 rounded-lg text-xs flex items-center justify-start py-3 shadow-md gap-3'>

                        <div>
                            {context.profilePicture.map((item2, index2) => {
                                if (item.profile === item2.name) return (
                                    <div key={index2}>
                                        <img src={item2.href}
                                            width={25}
                                            className='rounded-full hover:opacity-80 shadow-md select-none cursor-pointer'
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        <div>{item.name}</div>
                    </div>
                )
            })}
        </div>
    )
}