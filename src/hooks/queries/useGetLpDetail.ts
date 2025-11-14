import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpDetail(lpId: string) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, lpId], // lpId를 queryKey에 포함하여 각 LP마다 별도 캐시
        queryFn: () => getLpDetail(lpId),
        staleTime: 1000 * 60 * 5, // 5분간 데이터를 신선하게 유지
        gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
        retry: 3, // 실패 시 3번 재시도
        enabled: !!lpId, // lpId가 있을 때만 쿼리 실행
    });
}

export default useGetLpDetail;
