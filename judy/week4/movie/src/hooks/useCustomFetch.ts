import { useState, useEffect } from 'react';
import axios, { type AxiosRequestConfig } from 'axios';

interface UseCustomFetchResult<T> {
    data: T | null;
    isPending: boolean;
    isError: boolean;
    error: string | null;
}

export function useCustomFetch<T>(
    url: string,
    options?: AxiosRequestConfig
): UseCustomFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            setIsPending(true);
            setIsError(false);
            setError(null);

            try {
                const response = await axios.get<T>(url, {
                    ...options,
                    headers: {
                        'Authorization': `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        'Content-Type': 'application/json',
                        ...options?.headers,
                    },
                });
                setData(response.data);
            } catch (err) {
                setIsError(true);
                if (axios.isAxiosError(err)) {
                    setError(err.message || '데이터를 불러오는 중 에러가 발생했습니다.');
                } else {
                    setError('알 수 없는 에러가 발생했습니다.');
                }
            } finally {
                setIsPending(false);
            }
        };

        fetchData();
    }, [url, JSON.stringify(options)]);

    return { data, isPending, isError, error };
}
