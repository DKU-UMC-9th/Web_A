import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike, deleteLike } from "../apis/likes";
import type { ResponseLpDetailDTO } from "../types/lps";

interface UseLikeLpProps {
  lpId: number;
  userId?: number;
}

export const useLikeLp = ({ lpId, userId }: UseLikeLpProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isLiked }: { isLiked: boolean }) => {
      // 이미 좋아요를 눌렀으면 삭제, 아니면 추가
      if (isLiked) {
        return await deleteLike(lpId);
      } else {
        return await postLike(lpId);
      }
    },
    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 업데이트
    onMutate: async ({ isLiked }) => {
      const queryKey = ['lp', String(lpId)];

      // 진행 중인 refetch를 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 값을 백업 (롤백용)
      const previousLpData = queryClient.getQueryData<ResponseLpDetailDTO>(queryKey);

      // 낙관적 업데이트
      if (previousLpData && userId) {
        queryClient.setQueryData<ResponseLpDetailDTO>(queryKey, (old) => {
          if (!old) return old;

          const newLikes = isLiked
            ? // 좋아요 취소: 현재 사용자의 좋아요 제거
              old.data.likes.filter((like) => like.userId !== userId)
            : // 좋아요 추가: 새로운 좋아요 추가
              [
                ...old.data.likes,
                {
                  id: Date.now(), // 임시 ID (서버에서 실제 ID 받아옴)
                  userId,
                  lpId,
                },
              ];

          return {
            ...old,
            data: {
              ...old.data,
              likes: newLikes,
            },
          };
        });
      }

      // 롤백을 위해 이전 값 반환
      return { previousLpData };
    },
    // 에러 발생 시 이전 값으로 롤백
    onError: (_error, _variables, context) => {
      if (context?.previousLpData) {
        queryClient.setQueryData(['lp', String(lpId)], context.previousLpData);
      }
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    },
    // 성공 또는 실패와 관계없이 실행
    onSettled: () => {
      // 서버의 최신 데이터로 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['lp', String(lpId)] });
    },
  });
};
