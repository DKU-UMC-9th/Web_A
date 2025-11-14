import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, order, cursor, search, limit], // order를 앞쪽에 배치하여 정렬 변경 시 자동 리패치
        queryFn: () =>
            getLpList({
                cursor,
                search,
                order,
                limit,
            }),
        staleTime: 1000 * 60 * 5, // 5분간 데이터를 신선하게 유지
        gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
        retry: 3, // 실패 시 3번 재시도
    });
}

export default useGetLpList;
