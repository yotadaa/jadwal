'use client'

import { useEffect, useState, useContext } from 'react';
import AppContext from '../api/context/AppContext';
import Share from '../tugas/share';
import GetTask from '../tugas/get';
import { storeValue } from '../api/context/functionality';
import TaskAdd from '../tugas/task-form';
import Search from './search';

export default function TugasBar() {
    const context = useContext(AppContext);
    const [showShare, setShowShare] = useState(false);
    const [showGetTask, setShowGetTask] = useState(false);
    const [showTaskAdd, setShowTaskAdd] = useState(false);

    useEffect(() => {
        if (context.currentTugasMenu === -1) {
            context.getTugas(context.user.email);
        }
    }, [])

    useEffect(() => {
        // console.log('friendlist updated', context.friendList);
        context.setFriendList(context.friendList);
    }, [context.friendList]);

    return (
        <div className='p-2'>
            
            {context.showCari ? <Search /> : <div></div>}
            <div className='bg-blue-300 hover:font-bold mt-2 p-2 rounded-lg text-xs flex items-center justify-start py-3 gap-3 shadow-lg cursor-pointer select-none hover:opacity-80'
                onClick={() => {
                    setShowTaskAdd(true);
                    context.setNotif([])
                }}
            >
                <img
                    src='assets/plus.png'
                    width={20}
                />
                <div>Tambah Tugas</div>
            </div>
            <div className='bg-orange-400 hover:font-bold font-bold mt-2 p-2 rounded-lg text-xs flex items-center justify-start py-3 gap-3 shadow-lg cursor-pointer select-none hover:opacity-80'
                onClick={() => {
                    setShowGetTask(true);
                }}
            >
                <img
                    src='assets/inbox.png'
                    width={20}
                />
                <div>Ambil dari teman!</div>
            </div>
            <div className='bg-amber-300 hover:font-bold mt-2 p-2 rounded-lg text-xs flex items-center justify-start py-3 gap-3 shadow-lg cursor-pointer select-none hover:opacity-80'
                onClick={() => {
                    setShowShare(true);
                }}
            >
                <img
                    src='assets/send.png'
                    width={20}
                />
                <div>Share Tugas</div>
            </div>
            <div className='p-3 mt-3'>
                <div className='border-b-2 border-black border-dashed'></div>
            </div>
            <div className={`${context.currentTugasMenu === -1 ? "bg-emerald-300 " : "bg-white "} select-none cursor-pointer mt-2 p-2 rounded-lg font-bold text-base flex items-center justify-start py-3 shadow-md`}
                onClick={() => {
                    if (context.currentTugasMenu !== -1) {
                        context.setCurrentTugasMenu(-1);
                        storeValue("current-tugas-menu", -1);
                        context.getTugas(context.user.email);
                        context.setFriendEmail(context.user.email);
                    }
                }}
            >
                Punyamu
            </div>
            <div className='font-semibold mt-2 p-2 rounded-lg text-xs flex items-center justify-start py-3 '>
                Daftar Teman
            </div>
            {context.friendList.map((item, index) => {
                return (
                    <div key={index} className={`${context.currentTugasMenu === index ? "bg-emerald-300 " : "bg-white "} select-none cursor-pointer mt-2 p-2 rounded-lg text-xs flex items-center justify-start py-3 shadow-md gap-3`}
                        onClick={() => {
                            if (context.currentTugasMenu !== index) {
                                context.setCurrentTugasMenu(index);
                                // storeValue("current-tugas-menu", index);
                                context.getTugas(item.email);
                                context.setFriendName(item.name)
                                // storeValue("current-friend-name");
                                context.setFriendEmail(item.email)
                            }
                        }}
                    >
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
                        <div>
                            {item.name}
                        </div>
                    </div>
                )
            })}

            <Share component={{ showShare, setShowShare }} />
            <GetTask component={{ showGetTask, setShowGetTask }} />
            <TaskAdd component={{ showTaskAdd, setShowTaskAdd, }} edit={false} />
        </div>
    )
}