import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const loginUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); 
    };

    const registerUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); 
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('user'); 
    };

    return (
        <UserContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};
