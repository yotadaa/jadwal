// "use client"
import { ReactNode, useState, useEffect, useContext } from "react";
import { color } from './environment';
import AppContext from '../api/context/AppContext';
import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
    title: 'Jadwalku',
    description: '...',
}


interface PropsLayout {
    children: ReactNode;
}

export default function Container({ children }: PropsLayout) {

    const context = useContext(AppContext);
    const { light, dark } = color;
    const [currentColor, setCurrentColor] = useState(light);


    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const trackWindowSize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        trackWindowSize();

        window.addEventListener("resize", trackWindowSize);
        return () => window.removeEventListener("resize", trackWindowSize);
    }, []);

    useEffect(() => {
        setCurrentColor(!context.theme ? light : dark);
    }, [context.theme])


    return (
        <>
            <Head>
                <title>Jadwalku</title>
                <link
                    rel="icon"
                    href="assets/schedule.ico<generated>"
                    type="image/<generated>"
                    sizes="<generated>"
                />
                <meta name="description" content="A Simple schedule and task management app" />
            </Head>
            <div
                className={`${currentColor['latar']}`}
                style={{
                    width: windowWidth > 900 ? windowWidth : 900,
                    height: windowHeight > 675 ? windowHeight : 675,
                }}
            >
                {children}
            </div>
        </>
    );
}
