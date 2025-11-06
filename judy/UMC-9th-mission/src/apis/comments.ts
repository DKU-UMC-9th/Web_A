import type { ResponseCommentListDTO, ResponseCreateCommentDTO, ResponseUpdateCommentDTO, ResponseDeleteCommentDTO, RequestCreateCommentDTO, RequestUpdateCommentDTO } from "../types/comments";
import { axiosInstance } from "./axios";

// 댓글 목록 조회
export const getComments = async (
  lpId: number,
  cursor?: number,
  limit?: number,
  order: "asc" | "desc" = "desc"
): Promise<ResponseCommentListDTO> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
  });
  return data;
};

// 댓글 생성
export const postComment = async (
  lpId: number,
  body: RequestCreateCommentDTO
): Promise<ResponseCreateCommentDTO> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, body);
  return data;
};

// 댓글 수정
export const patchComment = async (
  lpId: number,
  commentId: number,
  body: RequestUpdateCommentDTO
): Promise<ResponseUpdateCommentDTO> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    body
  );
  return data;
};

// 댓글 삭제
export const deleteComment = async (
  lpId: number,
  commentId: number
): Promise<ResponseDeleteCommentDTO> => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return data;
};
