import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // 'light' (Morokko) | 'dark' (Guster)
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Sincroniza el atributo data-theme en html/body
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setSpecificTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setSpecificTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
