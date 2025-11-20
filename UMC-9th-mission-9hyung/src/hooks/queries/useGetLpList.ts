import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { type ResponseLpListDto } from "../../types/lp";

function useGetLpList(paginationDto: PaginationDto) {
    return useQuery<ResponseLpListDto, Error>({
        queryKey:[QUERY_KEY.lps, paginationDto],
        queryFn: () => getLpList(paginationDto),

        staleTime: 1000 * 60 * 1,
        gcTime: 1000 * 60 * 5, 
    });
}

export default useGetLpList;

