import { getLpDetail } from "../../apis/lp";
import { RequestLpDto } from "../../types/lp";
import{QUERY_KEY} from "../../constants/key.ts";
import {useQuery} from "@tanstack/react-query";

function useGetLpDetail({lpId}:RequestLpDto){
    return useQuery({
        queryKey:[QUERY_KEY.lps, lpId],
        queryFn: ()=>getLpDetail({lpId}:{lpId}),

    })
}
export default useGetLpDetail;