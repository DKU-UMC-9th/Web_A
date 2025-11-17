import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

interface UseGetCommentInfiniteListParams {
    lpId: string;
    order?: PaginationDto["order"];
    limit?: number;
}

function useGetCommentInfiniteList({ lpId, order = "desc", limit = 20 }: UseGetCommentInfiniteListParams) {
    return useInfiniteQuery({
        queryKey: ["lpComments", lpId, order],
        queryFn: async ({ pageParam }) => {
            const response = await getCommentList(lpId, {
                cursor: pageParam as number | undefined,
                limit,
                order,
            });
            return response;
        },
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
        staleTime: 1000 * 60 * 3,
        gcTime: 1000 * 60 * 10,
        enabled: !!lpId, // lpId가 있을 때만 쿼리 실행
    });
}

export default useGetCommentInfiniteList;
