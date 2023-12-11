import { useState, useContext } from "react"
import { useRouter } from 'next/navigation';
import AppContext from "../api/context/AppContext";

export default function LogoutConfirmation(props) {
    const router = useRouter();
    const context = useContext(AppContext);
    const { showConfirmation, setShowConfirmation } = props.visible;
    const style = 'w-20 bg-emerald-300 flex items-center justify-center py-1 rounded-full hover:opacity-80 cursor-pointer select-none'

    return (
        <div className={`${showConfirmation ? "block" : "hidden"} fixed top-0 left-0 w-screen h-screen flex justify-center items-center`}
            style={{
                backgroundColor: 'rgba(0,0,0,0.2',
                zIndex: 999999
            }}
        >
            <div className="bg-white flex flex-col items-center justify-center"
                style={{
                    width: 400,
                    height: 150
                }}
            >
                <h1 className="font-extrabold">KONFIRMASI LOGOUT</h1>
                <div className="flex gap-20 mt-10">
                    <div className={`${style}`}
                        onClick={() => {
                            setShowConfirmation(!showConfirmation)
                        }}
                    >
                        TIDAK
                    </div>
                    <div className={`${style}`}
                        onClick={() => {
                            setShowConfirmation(false);
                            localStorage.clear();
                            context.setUser({});
                            context.setIsLogin(false);
                            context.setTugas([])
                            context.setJadwal([])
                            context.setCurrentTugasMenu(-1);
                            context.setCurrentMenu(0);
                            router.push('/login');
                        }}
                    >YA</div>
                </div>
            </div>
        </div >
    )
}