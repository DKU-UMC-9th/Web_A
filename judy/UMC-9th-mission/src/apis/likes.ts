import type { ResponseLikeDTO } from "../types/likes";
import { axiosInstance } from "./axios";

// 좋아요 추가
export const postLike = async (lpId: number): Promise<ResponseLikeDTO> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

// 좋아요 삭제
export const deleteLike = async (lpId: number): Promise<ResponseLikeDTO> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};
