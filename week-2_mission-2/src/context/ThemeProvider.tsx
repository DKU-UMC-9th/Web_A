import { createContext, useContext, useState, type PropsWithChildren } from "react";

export const THEME = {
    LIGHT: "LIGHT",
    DARK: "DARK"
} as const;

type TTheme = typeof THEME.LIGHT | typeof THEME.DARK;

interface IThemeContext {
    theme: TTheme;
    toggleTheme: () => void;
}


export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children } : PropsWithChildren) => {
    const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

    const toggleTheme = () : void => {
        setTheme((prevTheme) =>
            prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
        )
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}


export const useTheme = () => {
    const context = useContext(ThemeContext);

    if(!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}