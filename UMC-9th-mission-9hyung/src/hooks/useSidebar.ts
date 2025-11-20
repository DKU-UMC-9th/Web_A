import { useEffect, } from "react";
import { useSidebar as useSidebarContext } from "../context/SidebarContext";



const useSidebar = () => {
    const { isOpen, openSidebar, closeSidebar, toggleSidebar } = useSidebarContext();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                closeSidebar();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, closeSidebar]);

    // 스크롤 잠금 로직 추가
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden" // 스크롤 막기
            document.documentElement.style.overflow = "hidden"; // ✅ html 태그도 잠금

        } else {
            document.body.style.overflow = "unset" // 스크롤 허용
            document.documentElement.style.overflow = "unset"; // ✅ html 태그도 해제

        }

        // cleanup: 컴포넌트가 언마운트될 때 스크롤 다시 허용 -> 안전장치
        return () => {
            document.body.style.overflow = "unset";
            document.documentElement.style.overflow = "unset";

        }
    }, [isOpen]);

    return { isOpen, openSidebar, closeSidebar, toggleSidebar };
}

export default useSidebar;