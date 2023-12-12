'use client'
import Daftar from './daftar';
import { useRouter } from 'next/navigation';
import { useEffect, useContext, useState } from 'react';
import AppContext from '../api/context/AppContext';

export default function Home() {

    const context = useContext(AppContext)

    const router = useRouter();
    useEffect(() => {
        context.setLeftBar(<div></div>)
        context.setRightBar(<div></div>)
        if (context.isLogin) {
            router.push("/")
        }
    }, [])


    return (
        <>
            <Daftar />
        </>
    );
}