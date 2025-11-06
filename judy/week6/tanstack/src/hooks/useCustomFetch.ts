import { useEffect, useState, useMemo, useRef } from "react";

const STALE_TIME = 0.5 * 60 * 1000; // 5 minutes

// 로컬스토리지에 저장할 데이터의 구조
interface CacheEntry<T> {
    data: T;
    lastFetched: number; // 마지막으로 데이터를 가져온 시간 (타임스탬프)
}

export const useCustomFetch = <T>(url: string) : {data: T | undefined, isPending: boolean, isError: boolean} => {
    const [data, setData] = useState<T | undefined>();
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const storageKey = useMemo(() : string => url, [url]);

    const abortControllerRef = useRef<AbortController | null>(null);
    
      useEffect(() => {
        abortControllerRef.current = new AbortController();
        setIsError(false);

        const fetchData = async () : Promise<void> => {
            const currentTime = Date.now();
            const cachedItem = localStorage.getItem(storageKey);

            // 캐시 데이터 확인, 신선도 검증
            try {
                if (cachedItem) {
                    const cachedData = JSON.parse(cachedItem) as CacheEntry<T>;

                    // 캐시가 신선한 경우
                    if (currentTime - cachedData.lastFetched < STALE_TIME) {
                        setData(cachedData.data);
                        setIsPending(false);
                        console.log('캐시된 데이터 사용', url);
                        return;
                    }

                    // 캐시가 만료된 경우
                    setData(cachedData.data); // 일단 캐시된 데이터 보여주기
                    console.log('만료된 캐시 데이터 사용', url);
                }
            } catch {
                localStorage.removeItem(storageKey);
                console.log('캐시 에러 : 캐시 삭제함', url)
            }
          try {
            setIsPending(true);
            setIsError(false);
            const response = await fetch(url, {
                signal: abortControllerRef.current?.signal,
            });

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            const data = (await response.json()) as T;
            setData(data);

            // 캐시에 저장
            const cacheEntry: CacheEntry<T> = {
              data,
              lastFetched: Date.now()
            };
            localStorage.setItem(storageKey, JSON.stringify(cacheEntry));
            console.log('새로운 데이터 캐시 저장', url);
          } catch (error) {
            console.error(error);

            if (error instanceof Error && error.name === 'AbortError') {
                console.log('요청 취소됨', url);

                return;
            }

            setIsError(true);
          } finally {
            setIsPending(false);
          }
        };

        fetchData();

        return ()=> {
            abortControllerRef.current?.abort();
        };
      }, [url, storageKey]);

      return { data, isPending, isError };
};