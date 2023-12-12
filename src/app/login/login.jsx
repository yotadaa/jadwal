'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import Link from 'next/link';
import { color } from '../components/environment';
import AppContext from '../api/context/AppContext';
import ToggleTheme from '../components/toggle-button';
import { decodeToken, getValue, storeValue } from '../api/context/functionality';
import { useRouter } from 'next/navigation';
import './expanding.css';

export default function Login() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => setIsLogin(getValue('login')), []);
    const user = decodeToken();

    const context = useContext(AppContext);
    const parent = useRef(null);
    const { light, dark } = color;
    const [currentColor, setCurrentColor] = useState(light);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef(null);
    const emailLabel = useRef(null);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [toggleTheme, setToggleTheme] = useState(true);
    useEffect(() => setToggleTheme(getValue('current-theme')), []);

    const submitForm = async (event) => {
        event.preventDefault();
        const emailToCheck = email;
        setError("");

        try {
            setProcessing(true);
            const res = await fetch("../api/mongos/users", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    todo: "login"
                }),
            });

            const data = await res.json()
            console.log(data);
            setError(data.err || "");
            if (data.success) {
                setEmail("");
                setPassword("");
                storeValue('login', data.success);
                storeValue('login-token', data.token);
                context.setUser(decodeToken());
                router.push('/akun');
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
        setProcessing(false);
    };

    useEffect(() => {
        setCurrentColor(!context.theme ? light : dark);
    }, [context.theme])

    useEffect(() => {
        context.setLeftBar(<div></div>)
        context.setRightBar(<div></div>)
        try {
            if (context.isLogin)
                router.push('/akun');
        } catch (error) {
            console.error('Error navigating to /:', error);
        }
    }, [])

    useEffect(() => {
        console.log(context.rightBar)
        console.log(context.leftBar)
    }, [context.rightBar, context.leftBar])

    if (!context.isLogin) return (
        <div
            ref={parent}
            className={`flex items-center justify-center ${currentColor['latar']} w-full h-full`}
        >
            {/* <div className={`expanding-background `} style={{ zIndex: 5 }}></div> */}
            <div className='absolute right-10 top-10' style={{ zIndex: 9 }}
            >
                <ToggleTheme

                />
            </div>
            <form
                className={`w-96 shadow-xl ${currentColor['form-auth-bg']} rounded-xl p-10 pb-15`}
                onSubmit={(event) => submitForm(event)}
                style={{ zIndex: 10 }}
            >

                <h1
                    className={`font-bold  text-2xl ${currentColor['form-auth-bg']} ${currentColor['form-text'] +
                        " "}`}
                    align="center">Login</h1>
                <div className="mt-10">
                    <input
                        ref={emailRef}
                        placeholder="Email"
                        value={email}
                        type='email'
                        className={`${currentColor['input-auth-placeholder']} focus:outline-none border ${currentColor['input-auth-bg']}  ${currentColor['input-auth-border']} rounded-3xl w-full p-2 pl-5 placeholder:text-base focus:${currentColor['input-auth-focus']}`}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>
                <div className="mt-5 flex justify-between gap-1">
                    <input
                        ref={emailRef}
                        placeholder="Password"
                        value={password}
                        className={`relative w-full ${currentColor['input-auth-placeholder']} focus:outline-none border bg-gray-200  ${currentColor['input-auth-border']} rounded-3xl w-full p-2 pl-5 placeholder:text-base focus:bg-white`}
                        onChange={(event) => setPassword(event.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        required
                    />
                    <img
                        className={`select-none cursor-pointer relative top-0 right-0 ${context.theme ? 'bg-gray-200' : 'bg-gray-300 '} hover:opacity-80 w-10 h-10 p-2 rounded-full`}
                        src={showPassword ? 'vis-on.svg' : 'vis-off.svg'}
                        style={{ color: 'white' }}
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
                <div className={`${processing ? 'block' : 'hidden'} flex items-center justify-center mt-5 p-1 bg-emerald-400 rounded-full`}>
                    <div>
                        Sedang diproses
                    </div>
                </div>
                <div className={`${error !== "" ? 'block' : 'hidden'} flex items-center justify-center mt-5 p-1 bg-red-500 rounded-full`}>
                    <div>
                        {error}
                    </div>
                </div>
                <div className="mt-5">
                    <input
                        value='Login'
                        className={`${currentColor['input-auth-placeholder']} focus:outline-none border ${currentColor['input-auth-submit']} ${currentColor['input-auth-border']} rounded-3xl w-full p-2 pl-5 placeholder:text-base ${currentColor['input-auth-submit-text']} font-bold cursor-pointer hover:opacity-80`}
                        type='submit'
                    />
                </div>
                <div className='mt-3 text-sm select-none '>
                    <Link href="/daftar" className={`hover:text-red-600 ${currentColor['form-text']}`}>Belum punya akun?</Link>
                </div>
            </form>
        </div>
    )
    else {
        return (
            <div>
                <div>You have logged in, go to <a className='text-red-500' href="/akun">Akun page</a></div>
            </div>
        )
    }
}