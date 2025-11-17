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

// 댓글 수정
export const updateComment = async (
    lpId: string,
    commentId: number,
    content: string
): Promise<Comment> => {
    const { data } = await axiosInstance.patch(
        `/v1/lps/${lpId}/comments/${commentId}`,
        { content }
    );
    return data.data;
};

// 댓글 삭제
export const deleteComment = async (
    lpId: string,
    commentId: number
): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};

// 이미지 업로드
export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const { data } = await axiosInstance.post("/v1/uploads", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    
    return data.data.imageUrl;
};

// LP 생성
interface CreateLpDto {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published?: boolean;
}

export const createLp = async (lpData: CreateLpDto): Promise<Lp> => {
    const { data } = await axiosInstance.post("/v1/lps", lpData);
    return data.data;
};

// LP 수정
interface UpdateLpDto {
    title?: string;
    content?: string;
    thumbnail?: string;
    tags?: string[];
    published?: boolean;
}

export const updateLp = async (lpId: string, lpData: UpdateLpDto): Promise<Lp> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, lpData);
    return data.data;
};

// LP 삭제
export const deleteLp = async (lpId: string): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${lpId}`);
};
