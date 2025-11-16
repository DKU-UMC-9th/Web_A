import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLpComment } from "../../apis/lpComments";
import { queryClient } from "../../App";
import type { RequestEditCommentDto } from "../../types/lpComments";
import { QUERY_KEY } from "../../constants/key";

export default function useEditComment(lpId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            commentId,
            body,
        }: {
            commentId: number,
            body: RequestEditCommentDto;
        }) => patchLpComment(lpId, commentId, body),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpComments, lpId]});
        }
    })
}