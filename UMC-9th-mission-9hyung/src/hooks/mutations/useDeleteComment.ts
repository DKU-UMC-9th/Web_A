import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../apis/lpComments";
import { QUERY_KEY } from "../../constants/key";

export default function useDeleteComment(lpId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: number) => deleteComment(lpId, commentId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpComments, lpId]});
        }
    })
}