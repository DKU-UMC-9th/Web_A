import { useState, useEffect } from 'react';
import { useThrottle } from './useThrottle';

interface WindowSize {
    width: number;
    height: number;
}

/**
 * useWindowSize - 윈도우 크기를 추적하는 훅 (useThrottle 적용)
 *
 * 리사이즈 이벤트는 매우 빈번하게 발생하므로 useThrottle로 최적화
 * @param throttleMs - 쓰로틀 간격 (기본값: 200ms)
 * @returns 현재 윈도우의 너비와 높이
 */
export function useWindowSize(throttleMs: number = 200): WindowSize {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    // useThrottle을 활용하여 리사이즈 이벤트 최적화
    // 빠른 리사이즈 시에도 throttleMs 간격으로만 업데이트
    const throttledWindowSize = useThrottle(windowSize, throttleMs);

    useEffect(() => {
        // 리사이즈 이벤트 핸들러
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // 리사이즈 이벤트 리스너 등록
        window.addEventListener('resize', handleResize);

        // 클린업: 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return throttledWindowSize;
}

/**
 * 사용 예시:
 *
 * const { width, height } = useWindowSize(300); // 300ms 간격으로 쓰로틀
 *
 * // 반응형 UI 처리
 * const isMobile = width < 768;
 * const isTablet = width >= 768 && width < 1024;
 * const isDesktop = width >= 1024;
 */
