'use client'

import { useState, createContext } from "react";
import AppContext from "./api/context/AppContext";

function myApp({ Component, pageProps }) {
    const [nameContext, setNameContext] = useState("default");
    return (
        <AppContext.Provider value={({ nameContext, setNameContext })}>

        </AppContext.Provider>
    )
}
