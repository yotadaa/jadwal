'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import Link from 'next/link';
import { color } from '../components/environment';
import AppContext from '../api/context/AppContext';
import ToggleTheme from '../components/toggle-button';
import { decodeToken, getValue, storeValue } from '../api/context/functionality';
import { useRouter } from 'next/navigation';
import FriendBar from "../components/friendBar";

export default function Daftar() {
    const router = useRouter();
    const context = useContext(AppContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const emailRef = useRef(null);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { light, dark } = color;
    const [toggleTheme, setToggleTheme] = useState(true);
    useEffect(() => setToggleTheme(getValue('current-theme')), []);
    const [currentColor, setCurrentColor] = useState(light);

    const changeTheme = () => {
        setToggleTheme(!toggleTheme);
    }

    const submitForm = async (e) => {
        e.preventDefault();
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
                    username: username,
                    todo: "daftar"
                }),
            });

            const data = await res.json();
            // console.log(data);
            setError(data.err || "");
            if (data.success) {
                try {
                    const login = await fetch("../api/mongos/users", {
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

                    const info = await login.json()
                    // console.log(info);
                    setError(info.err || "");
                    if (info.success) {
                        setEmail("");
                        setPassword("");
                        setUsername("");
                        setPasswordConfirm("");
                        storeValue('login', info.success);
                        storeValue('login-token', info.token);
                        context.setUser(info.user);
                        context.setIsLogin(true);
                        context.setRightBar(<FriendBar />)
                        router.push("/akun");
                    }
                } catch (error) {
                    console.error('Unexpected error:', error);
                }

            }
        } catch (error) {
        }
        setProcessing(false);
    };

    useEffect(() => {
        setCurrentColor(context.theme ? dark : light);
    }, [context.theme])

    useEffect(() => {
        if (password !== passwordConfirm) {
            setError("Password doesnt match");
        } else {
            setError("")
        }
    }, [password, passwordConfirm])

    if (!context.isLogin) return (
        <div className={`flex items-center justify-center ${currentColor['latar']} w-full h-full`}>
            <div className='absolute right-10 top-10'>
                <ToggleTheme />
            </div>
            <form
                className={`w-96 shadow-xl  ${currentColor['form-auth-bg']} rounded-xl p-10 pb-15`}
                onSubmit={(e) => submitForm(e)}
                onClick={() =>
                    changeTheme()
                }
            >
                <h1
                    className={`font-bold  text-2xl ${currentColor['form-auth-bg']} ${currentColor['form-text'] +
                        " "}`}
                    align="center">Daftar</h1>
                <div className="mt-10">
                    <input
                        placeholder="Username"
                        value={username}
                        type='text'
                        className={`${currentColor['input-auth-placeholder']} focus:outline-none border ${currentColor['input-auth-bg']}  ${currentColor['input-auth-border']} rounded-3xl w-full p-2 pl-5 placeholder:text-base focus:${currentColor['input-auth-focus']}`}

                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                </div>
                <div className="mt-5">
                    <input
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
                <div className="mt-5 flex justify-between gap-1">
                    <input
                        ref={emailRef}
                        placeholder="Password"
                        value={passwordConfirm}
                        className={`relative w-full ${currentColor['input-auth-placeholder']} focus:outline-none border bg-gray-200  ${currentColor['input-auth-border']} rounded-3xl w-full p-2 pl-5 placeholder:text-base focus:bg-white`}
                        onChange={(event) => setPasswordConfirm(event.target.value)}
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                    />
                    <img
                        className={`select-none cursor-pointer relative top-0 right-0 ${context.theme ? 'bg-gray-200' : 'bg-gray-300 '} hover:opacity-80 w-10 h-10 p-2 rounded-full`}
                        src={showConfirmPassword ? 'vis-on.svg' : 'vis-off.svg'}
                        style={{ color: 'white' }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                        placeholder="Password"
                        value='Daftar'
                        className={`${currentColor['input-auth-placeholder']} focus:outline-none border ${currentColor['input-auth-submit']} ${currentColor['input-auth-border']} rounded-3xl w-full p-2 pl-5 placeholder:text-base ${currentColor['input-auth-submit-text']} font-bold cursor-pointer hover:opacity-80`}
                        type='submit'
                    />
                </div>
                <div className='mt-3 text-sm select-none '>
                    <Link href="/login" className={`hover:text-red-600 ${currentColor['form-text']}`}>Sudah  punya akun?</Link>
                </div>
            </form>
        </div>
    )
    else return (
        <div>
            <div>You have logged in, go to <a className='text-red-500' href="/akun">Akun page</a></div>
        </div>
    )
}