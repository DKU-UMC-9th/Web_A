import { useMutation } from "@tanstack/react-query";
import { patchUserInfo } from "../../apis/user";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

export default function usePatchUserInfo() {
  return useMutation({
    mutationFn: patchUserInfo,

    onMutate: async (newInfo) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      const previous = queryClient.getQueryData([QUERY_KEY.myInfo]);

      queryClient.setQueryData([QUERY_KEY.myInfo], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            name: newInfo.name ?? old.data.name,
            bio: newInfo.bio ?? old.data.bio,
            avatar: newInfo.avatar ?? old.data.avatar,
          },
        };
      });

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData([QUERY_KEY.myInfo], ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}
