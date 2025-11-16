import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lpLikes";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function usePostLike(lpId?: number) {
    return useMutation({
        mutationFn: postLike,
        // data -> API 성공 응답 데이터
        // variables -> mutate에 전달한 값
        // context -> onMutate에서 반환한 값
        
        onMutate: async () => {
            if (!lpId) return;

            await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lps, lpId]});

            const prev = queryClient.getQueryData([QUERY_KEY.lps, lpId]);

            queryClient.setQueryData([QUERY_KEY.lps, lpId], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        likes: [
                            ...(old.data.likes ?? []),
                            { useId: old.data.authorId ?? 0},
                        ]
                    }
                }
            })

            return { prev };
        },

        onError: (_err, _vars, ctx) => {
            if (ctx?.prev && lpId) {
                queryClient.setQueryData([QUERY_KEY.lps, lpId], ctx.prev);
            }
        },

        onSettled: () => {
            if (!lpId) return;
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, lpId]})
        }
    })
}

export default usePostLike;