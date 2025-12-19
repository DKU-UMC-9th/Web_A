import { useState, useCallback, useEffect } from 'react';

interface UseSidebarReturn {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

/**
 * useSidebar - Sidebar의 열림/닫힘 상태를 관리하는 커스텀 훅
 *
 * @param initialState - 초기 상태 (기본값: true)
 * @returns {UseSidebarReturn} Sidebar 상태와 제어 함수들
 *
 * 제공 기능:
 * - isOpen: 현재 Sidebar의 열림/닫힘 상태
 * - open(): Sidebar를 여는 함수
 * - close(): Sidebar를 닫는 함수
 * - toggle(): Sidebar 상태를 토글하는 함수
 * - 배경 스크롤 방지: Sidebar가 열리면 body 스크롤 차단
 */
export function useSidebar(initialState: boolean = true): UseSidebarReturn {
    const [isOpen, setIsOpen] = useState<boolean>(initialState);

    // Sidebar를 여는 함수
    // useCallback으로 메모이제이션하여 불필요한 리렌더링 방지
    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    // Sidebar를 닫는 함수
    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    // Sidebar 상태를 토글하는 함수
    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    // Sidebar가 열릴 때 배경 스크롤 방지
    useEffect(() => {
        const isSmallScreen = window.innerWidth < 1024; // lg breakpoint

        if (isOpen && isSmallScreen) {
            // 현재 스크롤 위치 저장
            const scrollY = window.scrollY;

            // body 스크롤 차단
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            // 스크롤 위치 복원
            const scrollY = document.body.style.top;

            // body 스크롤 복원
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';

            // 이전 스크롤 위치로 복귀
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        // 클린업: 컴포넌트 언마운트 시 스크롤 복원
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    return {
        isOpen,
        open,
        close,
        toggle,
    };
}