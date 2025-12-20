import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLpUpdate } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestLpUpdateDto } from "../../types/lp";

export default function useEditLp(lpId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            body
        }: {
          body: RequestLpUpdateDto  
        }) => patchLpUpdate(lpId, body),
        
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps, lpId],
            })
        }
    })
}