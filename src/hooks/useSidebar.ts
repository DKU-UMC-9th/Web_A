import { useState, useEffect } from "react";

/**
 * useSidebar 커스텀 훅
 * Sidebar의 열림/닫힘 상태를 관리합니다.
 * 
 * @returns {Object} Sidebar 상태 및 제어 함수들
 * - isOpen: Sidebar 열림 상태
 * - open: Sidebar를 여는 함수
 * - close: Sidebar를 닫는 함수
 * - toggle: Sidebar 상태를 토글하는 함수
 */
export const useSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Sidebar를 여는 함수
    const open = () => {
        setIsOpen(true);
    };

    // Sidebar를 닫는 함수
    const close = () => {
        setIsOpen(false);
    };

    // Sidebar 상태를 토글하는 함수
    const toggle = () => {
        setIsOpen(prev => !prev);
    };

    // ESC 키로 Sidebar 닫기
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                close();
            }
        };

        // keydown 이벤트 리스너 등록
        window.addEventListener("keydown", handleKeyDown);

        // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    // 배경 스크롤 방지
    useEffect(() => {
        if (isOpen) {
            // Sidebar가 열릴 때: body 스크롤 비활성화
            document.body.style.overflow = "hidden";
        } else {
            // Sidebar가 닫힐 때: body 스크롤 복원
            document.body.style.overflow = "unset";
        }

        // 클린업 함수: 컴포넌트 언마운트 시 스크롤 복원
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return {
        isOpen,
        open,
        close,
        toggle,
    };
};
