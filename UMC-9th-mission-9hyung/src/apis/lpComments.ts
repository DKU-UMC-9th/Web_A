import type { RequestCreateCommentDto, RequestEditCommentDto, ResponseCommnetListDto, ResponseCreateCommentDto, ResponseDeletecCommentDto, ResponseEditCommentDto } from "../types/lpComments"
import { axiosInstance } from "./axios"

// 댓글 목록 조회 API
export const getLpComment = async (
    lpId: number,
    cursor: number,
    limit: number,
    order: "asc" | "desc",
) : Promise<ResponseCommnetListDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params: { cursor, limit, order },
    })
    return data;
}

// 댓글 생성 API
export const postLpComment = async (
    lpId: number,
    body: RequestCreateCommentDto,
) : Promise<ResponseCreateCommentDto> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, body);
    return data;
}

// 댓글 수정 API
export const patchLpComment = async (
    lpId: number,
    commentId: number,
    body: RequestEditCommentDto,
) : Promise<ResponseEditCommentDto> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, body);
    return data;
}

// 댓글 삭제 API
export const deleteComment = async (
    lpId: number,
    commentId: number,
) : Promise<ResponseDeletecCommentDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
    return data;
}

