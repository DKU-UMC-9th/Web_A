import { useCallback, useEffect, useRef, useState } from "react";

type Fetcher<T> = () => Promise<T>;

export interface UseCustomFetchOptions<T> {
  depsKey?: string;     // 의존성 변경 트리거 키
  immediate?: boolean;  // 마운트 시 자동 실행
  mapData?: (raw: unknown) => T;
}

export function useCustomFetch<T>(
  fetcher: Fetcher<T>,
  { depsKey = "", immediate = true, mapData }: UseCustomFetchOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError(null);
    try {
      const raw = await fetcher();
      if (!ctrl.signal.aborted) {
        setData(mapData ? mapData(raw) : (raw as T));
      }
    } catch (e: unknown) {
      if (!ctrl.signal.aborted) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error(String(e)));
        }
      }
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, [fetcher, mapData]);

  useEffect(() => {
    if (immediate) run();
    return () => abortRef.current?.abort();
  }, [depsKey, immediate, run]);

  const refetch = useCallback(() => run(), [run]);

  return { data, loading, error, refetch };
}

export default useCustomFetch;
