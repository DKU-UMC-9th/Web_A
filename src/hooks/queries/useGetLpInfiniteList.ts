import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

interface UseGetLpInfiniteListParams {
    order?: PaginationDto["order"];
    search?: string;
    limit?: number;
}

function useGetLpInfiniteList({ order, search, limit = 20 }: UseGetLpInfiniteListParams) {
    // 검색어가 공백만 있는 경우 빈 문자열로 처리
    const trimmedSearch = search?.trim() || "";
    
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, order, trimmedSearch],
        queryFn: async ({ pageParam }) => {
            const response = await getLpList({
                cursor: pageParam as number | undefined,
                limit,
                search: trimmedSearch || undefined, // 빈 문자열이면 undefined로
                order,
            });
            return response;
        },
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => {
            // 서버가 배열만 반환하는 경우, 데이터가 limit보다 적으면 마지막 페이지
            if (lastPage.length < limit) {
                return undefined;
            }
            // 다음 cursor는 마지막 아이템의 id 사용
            const lastItem = lastPage[lastPage.length - 1];
            return lastItem?.id;
        },
        // 캐시 최적화
        staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
        gcTime: 1000 * 60 * 10,   // 10분간 캐시 보관
    });
}

export default useGetLpInfiniteList;
