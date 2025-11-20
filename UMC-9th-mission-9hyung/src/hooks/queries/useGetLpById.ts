import { useQuery } from "@tanstack/react-query"
import type { ResponseLpDetailDto } from "../../types/lp"
import { QUERY_KEY } from "../../constants/key"
import { getLpById } from "../../apis/lp"


const useGetLpById = (lpid: string | undefined) => {
    return useQuery<ResponseLpDetailDto, Error>({
        queryKey: [QUERY_KEY.lp, lpid],
        queryFn: () => getLpById(lpid!),
        enabled: !!lpid,
        staleTime: 1000 * 60 * 1,
    })
}

export default useGetLpById;