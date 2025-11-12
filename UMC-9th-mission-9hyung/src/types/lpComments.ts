import type { CommonResponse } from "./common";


// 댓글 단일 아이템
export type CommentItem = {
    id: number;
    content: string;
    lpId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    author: CommentAuthor;
}

// 작성자 정보
export type CommentAuthor = {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}

// 댓글 목록 조회 응답 Dto
export type ResponseCommnetListDto = CommonResponse<{
    data: CommentItem[];
    nextCursor: number;
    hasNext: boolean;
}>

// 댓글 생성 요청 Dto
// 요청은 content만 필요함
export type RequestCreateCommentDto = {
    content: string;
}

// 댓글 생성 응답 Dto
export type ResponseCreateCommentDto = CommonResponse<CommentItem>

// 댓글 수정 요청 Dto
// 수정 요정도 content만 필요함
export type RequestEditCommentDto = {
    content: string;
}

// 댓글 수정 응답 Dto
export type ResponseEditCommentDto = CommonResponse<CommentItem>

// 댓글 삭제 응답 Dto
export type ResponseDeletecCommentDto = CommonResponse<{
    message: string;
}>
