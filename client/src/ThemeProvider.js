import React, { useContext, useState } from 'react'

const ThemeContext = React.createContext()
const ThemeUpdateContext = React.createContext()

export function useTheme() {
    return useContext(ThemeContext)
}

export function useThemeUpdate() {
    return useContext(ThemeUpdateContext)
}

export function ThemeProvider({ children }) {
    const [isLogin, setIsLogin] = useState(false)

    return (
        <ThemeContext.Provider value={isLogin}>
            <ThemeUpdateContext.Provider value={setIsLogin}>
                {children}
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    )
}