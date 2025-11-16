import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lpLikes";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function usePostLike() {
    return useMutation({
        mutationFn: postLike,
        // data -> API 성공 응답 데이터
        // variables -> mutate에 전달한 값
        // context -> onMutate에서 반환한 값
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps, data.data.lpId],
                exact: true,
            })
        }
    })
}

export default usePostLike;