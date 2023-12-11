'use client'
import React, { createContext, useContext, ReactNode } from 'react';

// Define the context
interface MyContextProps {
    value: string;
    updateValue: (newValue: string) => void;
}

const MyContext = createContext<MyContextProps | undefined>(undefined);

// Define a provider component
interface PropsLayout {
    children: ReactNode;
}

export const MyContextProvider = ({ children }: PropsLayout) => {
    const [value, setValue] = React.useState('Default Value');

    const updateValue = (newValue: string) => {
        setValue(newValue);
    };

    return (
        <MyContext.Provider value={{ value, updateValue }}>
            {children}
        </MyContext.Provider>
    );
};

// Custom hook to use the context
export const useMyContext = () => {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error('useMyContext must be used within a MyContextProvider');
    }
    return context;
};
