import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RequestCreateCommentDto } from "../../types/lpComments";
import { postLpComment } from "../../apis/lpComments";
import { QUERY_KEY } from "../../constants/key";

export default function usePostComment(lpId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: RequestCreateCommentDto) =>
            postLpComment(lpId, body),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpComments, lpId]});
        }
    })

    
}