import clsx from "clsx";
import { useTheme, THEME } from "./context/ThemeProvider"

export default function ThemeToggleButton () {
    const { theme, toggleTheme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;

    return(
        <button className={clsx('px-4 py-2 mt-4 rounded-md transition cursor-pointer', {
            'bg-black text-white': !isLightMode,
            'bg-white text-black': isLightMode,
        })} onClick={toggleTheme}>
            {isLightMode ? '🌙 다크 모드' : '☀️ 라이트 모드'}
        </button>
    )
}