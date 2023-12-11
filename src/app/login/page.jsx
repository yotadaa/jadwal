'use client'
import Login from './login';
import Container from '../components/container';
import { useRouter } from 'next/navigation';
import { useEffect, useContext } from 'react';
import { decodeToken, getValue } from '../api/context/functionality';
import AppContext from '../api/context/AppContext';

export default function Home() {

    const isLogin = getValue('login') || false;
    const user = decodeToken();
    const context = useContext(AppContext)

    const router = useRouter();
    useEffect(() => {
        context.setLeftBar(<div></div>)
        context.setRightBar(<div></div>)
        if (isLogin && user) {
            router.push("/")
        }
    }, [])


    return (
        <>
            <Login />
        </>
    );
}