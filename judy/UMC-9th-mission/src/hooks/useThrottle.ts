import { useState, useEffect, useRef } from 'react';

/**
 * useThrottle - 값 지연형 쓰로틀 훅
 * @param value - 쓰로틀할 값
 * @param interval - 쓰로틀 간격 (ms)
 * @returns 쓰로틀된 값
 *
 * 동작 방식:
 * - 처음 값이 변경되면 즉시 업데이트
 * - 이후 interval 시간 동안은 값 변경을 무시
 * - interval이 지나면 마지막 값으로 업데이트
 */
export function useThrottle<T>(value: T, interval: number): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastRan = useRef<number>(Date.now());
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const now = Date.now();
        const timeSinceLastRan = now - lastRan.current;

        // interval 시간이 지났으면 즉시 업데이트
        if (timeSinceLastRan >= interval) {
            setThrottledValue(value);
            lastRan.current = now;
        } else {
            // interval 시간이 안 지났으면 남은 시간 후에 업데이트 예약
            const remainingTime = interval - timeSinceLastRan;

            // 기존 타이머가 있으면 취소
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // 남은 시간 후에 업데이트
            timeoutRef.current = setTimeout(() => {
                setThrottledValue(value);
                lastRan.current = Date.now();
                timeoutRef.current = null;
            }, remainingTime);
        }

        // 언마운트 또는 의존성 변경 시 타이머 정리
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [value, interval]);

    return throttledValue;
}
