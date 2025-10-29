import { useTheme, THEME } from "./context/ThemeProvider"
import ThemeToggleButton from "./ThemeToggleButton.tsx";
import clsx from "clsx";

export default function NavBar () {
    const { theme } = useTheme();
    const isLightMode = theme === THEME.LIGHT;
    return(
        <nav className={clsx(
            'px-4 w-full flex justify-end',
            isLightMode ? 'bg-white' : 'bg-gray-800'
        )}>
            <ThemeToggleButton />
        </nav>
    )
}