import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lpLikes";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";

function useDeleteLike(lpId?: number, myUserId?: number) {
  return useMutation({
    mutationFn: deleteLike,
    onMutate: async () => {
      if (!lpId) return;

      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lps, lpId] });

      const prev = queryClient.getQueryData([QUERY_KEY.lps, lpId]);

      queryClient.setQueryData([QUERY_KEY.lps, lpId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            likes: old.data.likes.filter((l: any) => l.userId !== myUserId),
          },
        };
      });

      return { prev };
    },

    // 실패 → 롤백
    onError: (_err, _var, ctx) => {
      if (ctx?.prev && lpId) {
        queryClient.setQueryData([QUERY_KEY.lps, lpId], ctx.prev);
      }
    },

    // 끝나면 최신 정보 refetch
    onSettled: () => {
      if (lpId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, lpId] });
      }
    },
  });
}

export default useDeleteLike;
