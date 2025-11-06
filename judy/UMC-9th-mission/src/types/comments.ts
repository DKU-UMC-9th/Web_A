import type { CommonResponse } from "./common";

// 작성자 타입 (LP와 동일)
export type CommentAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

// 댓글 단일 항목
export type CommentItem = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
};

// 댓글 목록 조회 응답 DTO
export type ResponseCommentListDTO = CommonResponse<{
  data: CommentItem[];
  nextCursor: number;
  hasNext: boolean;
}>;

// 댓글 생성 요청 DTO
export type RequestCreateCommentDTO = {
  content: string;
};

// 댓글 생성 응답 DTO
export type ResponseCreateCommentDTO = CommonResponse<CommentItem>;

// 댓글 수정 요청 DTO
export type RequestUpdateCommentDTO = {
  content: string;
};

// 댓글 수정 응답 DTO
export type ResponseUpdateCommentDTO = CommonResponse<CommentItem>;

// 댓글 삭제 응답 DTO
export type ResponseDeleteCommentDTO = CommonResponse<{
  message: string;
}>;
