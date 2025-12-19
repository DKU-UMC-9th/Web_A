import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, patchMyInfo } from "../apis/auth";
import type { RequestUpdateMyInfoDTO, ResponseMyInfoDTO } from "../types/auth";
import { useAuth } from "../context/AuthContext";

const QUERY_KEY = ['user', 'me'] as const;

export const useMyInfo = () => {
  const { accessToken } = useAuth();

  return useQuery<ResponseMyInfoDTO>({
    queryKey: QUERY_KEY,
    queryFn: getMyInfo,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    enabled: !!accessToken, // 로그인 상태일 때만 쿼리 실행
  });
};

export const useUpdateMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchMyInfo,
    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 업데이트
    onMutate: async (newUserInfo: RequestUpdateMyInfoDTO) => {
      // 진행 중인 refetch를 취소하여 낙관적 업데이트를 덮어쓰지 않도록 함
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      // 이전 값을 백업 (롤백용)
      const previousUserInfo = queryClient.getQueryData<ResponseMyInfoDTO>(QUERY_KEY);

      // 낙관적 업데이트: 새로운 데이터로 즉시 업데이트
      if (previousUserInfo) {
        queryClient.setQueryData<ResponseMyInfoDTO>(QUERY_KEY, {
          ...previousUserInfo,
          data: {
            ...previousUserInfo.data,
            ...newUserInfo,
          }
        });
      }

      // 롤백을 위해 이전 값 반환
      return { previousUserInfo };
    },
    // 에러 발생 시 이전 값으로 롤백
    onError: (_error, _newUserInfo, context) => {
      if (context?.previousUserInfo) {
        queryClient.setQueryData(QUERY_KEY, context.previousUserInfo);
      }
      alert('프로필 수정에 실패했습니다. 다시 시도해주세요.');
    },
    // 성공 또는 실패와 관계없이 실행
    onSettled: () => {
      // 서버의 최신 데이터로 다시 가져오기
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
