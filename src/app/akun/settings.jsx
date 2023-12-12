
import ToggleTheme from '../components/toggle-button';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../api/context/AppContext';
import { storeValue, relog } from '../api/context/functionality';
import LogoutConfirmation from '../components/logout-dialog';
import Profile from './profile';

export default function Settings() {
    const context = useContext(AppContext);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const style = 'bg-emerald-300 hover:shadow-lg mb-2 p-1 rounded-full px-2 cursor-pointer select-none hover:opacity-80'
    useEffect(() => {
        storeValue("current-theme", !context.theme)
    }, [context.theme])

    return (
        <>
            <div className="flex flex-col text-right ">
                <div className={`${style} ${context.theme ? "bg-teal-400" : "bg-teal-400"} border border-black`}
                    onClick={() => {
                        setShowProfile(true);
                    }}
                >
                    Ganti Profile
                </div>
                <div className={`${style} ${context.theme ? "bg-teal-400" : "bg-teal-400"} border border-black`}
                    onClick={() => {
                        context.setTheme(!context.theme);
                    }}
                >
                    Mode {context.theme ? "Terang" : "Gelap"}
                </div>
                <div className={`${style} ${context.theme ? "bg-teal-400" : "bg-teal-400"} border border-black`}
                    onClick={() => {
                        setShowConfirmation(!showConfirmation)
                        console.log(showConfirmation);
                    }}
                >
                    Logout
                </div>
            </div>
            <LogoutConfirmation visible={{ showConfirmation, setShowConfirmation }} />
            <Profile visible={{ showProfile, setShowProfile }} />
        </>
    )
}