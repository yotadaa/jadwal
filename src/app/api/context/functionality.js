'use client'
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import AppContext from './AppContext';

export function getWaktu(string) {
    var data = string.split(" ");
    // data[0] = data[0] >= 10 ? data[0] : "0" + data[0];
    // data[1] = data[1] >= 10 ? data[1] : "0" + data[1];
    return data;
}
export const getCurrentDateTime = () => {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `${day}${month}${year}${hours}${minutes}${seconds}${milliseconds}`;
};

export function epochToFormattedDatetime(epochSeconds) {
    const date = new Date(epochSeconds * 1000);
    const formattedDatetime = date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
    return formattedDatetime;
}

export function storeValue(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to store value in localStorage for key "${key}":`, error);
    }
}

export function getValue(key) {
    try {
        const value = localStorage.getItem(key);
        if (value !== undefined) {
            return JSON.parse(value);
        }
    } catch (error) {
        console.error(`Failed to retrieve value from localStorage for key "${key}":`, error);
    }
    return null;
}

export function getCurrentTimeInSeconds() {
    const currentDate = new Date();
    const currentTimestampInSeconds = Math.floor(currentDate.getTime() / 1000);
    return currentTimestampInSeconds;
}

export function checkLocalStorage(key) {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            const value = localStorage.getItem(key);
            if (value !== null) {
                return JSON.parse(value);
            }
        } catch (error) {
            console.error(`Failed to retrieve value from localStorage for key "${key}":`, error);
        }
    }
    return null;
}

export function decodeToken() {
    const isLogin = checkLocalStorage('login') || false;
    const loginInfo = isLogin ? getValue("login-token") : "";
    return isLogin ? jwtDecode(loginInfo)._doc : {};
}
