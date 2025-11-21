import { useEffect, useState } from "react";

/**
 * useDebounce 커스텀 훅
 * 
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (밀리초, 권장: 300ms)
 * @returns 지연된 값
 * 
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 */
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // delay 시간 후에 값을 업데이트하는 타이머 설정
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 클린업 함수: 컴포넌트 언마운트 또는 value/delay 변경 시 타이머 정리
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]); // value나 delay가 변경될 때마다 effect 재실행

    return debouncedValue;
}

export default useDebounce;
