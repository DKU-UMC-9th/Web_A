import { useState, useEffect } from 'react';

/**
 * useDebounce - 값 지연형 디바운스 훅
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (ms)
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // delay 시간 후에 값을 업데이트
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 언마운트 또는 의존성 변경 시 타이머 정리
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]); // value나 delay가 변경되면 타이머 재설정

    return debouncedValue;
}
