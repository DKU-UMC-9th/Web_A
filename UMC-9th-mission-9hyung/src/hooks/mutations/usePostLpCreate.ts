import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { RequestLpCreateDto } from "../../types/lp";
import { postLpCreate } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export const usePostLpCreate = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: RequestLpCreateDto) => postLpCreate(body),
        onSuccess: () => {
            // LP 목록 캐시 초기화 -> 자동 새로고침
            queryClient.invalidateQueries({ queryKey:[QUERY_KEY.lps]})

            // 모달 닫기 or callback 실행
            if (onSuccess) onSuccess();
        },
        onError: (error) => {
            console.log("LP 생성 실패:", error);
        }
    })
}