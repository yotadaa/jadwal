import { ReactNode, ReactElement, useContext, useState, useEffect } from 'react';
import Menu from './left-bar';
import Container from './container';
import { color } from './environment';
import AppContext from '../api/context/AppContext';
import Head from 'next/head';
import JadwalBar from './jadwalBar';


export default function Master({ children }) {
    const context = useContext(AppContext);
    const { light, dark } = color;
    const [windowWidth, setWindowWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);
    const [currentColor, setCurrentColor] = useState(light);
    const [initialShow, setInitialShow] = useState(false);
    const [currentPath, setCurrentPath] = useState("");
    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, [currentPath])
    const [show, setShow] = useState(false);

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
        context.setWindowWidth(windowWidth);
    }, [windowWidth])

    useEffect(() => {
        // console.log(window.location.pathname)
        if (context.jadwal && context.user) {
            setInitialShow(true);
        } else setInitialShow(false);
    }, [context.user, context.tugas, context.jadwal])

    useEffect(() => {
        setShow((currentPath === "/login" || currentPath === "/daftar"));
        const newLocal = currentPath === "/";
        if (currentPath !== "/cari") {

        } else if (newLocal) {
            context.setRightBar(<JadwalBar />)
        }
    }, [currentPath])

    return (
        <Container >
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
            <div className={`flex justify-center ${initialShow ? "opacity-100" : "opacity-100"}`}
            >
                <div
                    className={` overflow-y-auto custom-scrollbar`}
                    style={{
                        width: 200,//windowWidth > 700 ? 200 : 70,
                        height: windowHeight > 675 ? windowHeight : 675,
                    }}>
                    {context.leftBar}
                </div>
                <div className={` overflow-y-auto overflow-x-hidden custom-scrollbar`}
                    style={{
                        width: 500,
                        height: windowHeight > 675 ? windowHeight : 675,
                        paddingBottom: context.paddingTugas,
                        zIndex: 0
                        // marginBottom: context
                    }}
                >
                    {children}
                </div>
                <div
                    className={` overflow-y-auto custom-scrollbar`}
                    style={{
                        width: 200,//windowWidth > 700 ? 200 : 70,
                        height: windowHeight > 675 ? windowHeight : 675,
                    }}>
                    {show ? <div></div> : context.rightBar}
                </div>
            </div>
        </Container>
    );
}