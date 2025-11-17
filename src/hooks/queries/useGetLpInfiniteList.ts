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
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, order],
        queryFn: async ({ pageParam }) => {
            const response = await getLpList({
                cursor: pageParam as number | undefined,
                limit,
                search,
                order,
            });
            return response;
        },
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage, allPages) => {
            // 서버가 배열만 반환하는 경우, 데이터가 limit보다 적으면 마지막 페이지
            if (lastPage.length < limit) {
                return undefined;
            }
            // 다음 cursor는 마지막 아이템의 id 사용
            const lastItem = lastPage[lastPage.length - 1];
            return lastItem?.id;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export default useGetLpInfiniteList;
