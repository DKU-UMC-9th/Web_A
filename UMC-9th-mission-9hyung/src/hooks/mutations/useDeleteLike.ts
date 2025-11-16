import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lpLikes";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,
      });
    },
  });
}

export default useDeleteLike;
