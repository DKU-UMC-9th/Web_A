import { useState, useEffect } from 'react';
import axios from 'axios';


export const useCustomFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            setIsPending(true);
            setIsError(false);

            const options = {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                }
            }

            try {
                const response = await axios.get<T>(url, options);
                setData(response.data);
            } catch (error) {
                setIsError(true);
                console.error(error);
            } finally {
                setIsPending(false);
            }
        }

        fetchData();
    }, [url]);


    return { data, isPending, isError};
}