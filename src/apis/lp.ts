import type { PaginationDto } from "../types/common";
import type { Lp, ResponseCommentListDto, Comment } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto): Promise<Lp[]> => {
    const { data } = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    });

    // API 응답: { status, statusCode, message, data: { data: [...] } }
    // data.data.data를 반환
    return data.data.data;
};

// LP 상세 조회
export const getLpDetail = async (lpId: string): Promise<Lp> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
    
    // API 응답: { status, statusCode, message, data: { ... } }
    return data.data;
};

// 댓글 목록 조회
export const getCommentList = async (
    lpId: string,
    paginationDto: PaginationDto
): Promise<ResponseCommentListDto> => {
    const { cursor, limit = 20, order = "desc" } = paginationDto;
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params: { cursor, limit, order },
    });
    return data;
};

// 댓글 생성
export const createComment = async (
    lpId: string,
    content: string
): Promise<Comment> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
        content,
    });
    return data;
};
