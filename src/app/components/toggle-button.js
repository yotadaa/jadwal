'use client'
import { useState, useContext, useEffect } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import AppContext from '../api/context/AppContext';
import { getValue, storeValue } from '../api/context/functionality';

export default function ToggleTheme() {
    const [isDarkMode, setDarkMode] = useState(false);
    useEffect(() => {
        setDarkMode(getValue("current-theme"));
    }, [])
    const context = useContext(AppContext);

    useEffect(() => {
        storeValue("current-theme", checked);
    }, [context.theme])

    const toggleDarkMode = (checked) => {
        setDarkMode(checked);
        context.setTheme(checked);
    };

    return (
        <DarkModeSwitch
            style={{ marginBottom: '2rem' }}
            checked={isDarkMode}
            onChange={toggleDarkMode}
            size={25}
        />
    );
}