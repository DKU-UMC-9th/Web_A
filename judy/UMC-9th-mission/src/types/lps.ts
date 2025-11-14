import type { CommonResponse } from "./common";

// 태그 타입
export type LpTag = {
  id: number;
  name: string;
};

// 좋아요 타입
export type LpLike = {
  id: number;
  userId: number;
  lpId: number;
};

// 작성자 타입
export type LpAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

// LP 단일 아이템 (기본 목록용)
export type LpItem = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: LpTag[];
  likes: LpLike[];
};

// LP 목록 데이터 구조
export type LpListData = {
  data: LpItem[];
  nextCursor: number;
  hasNext: boolean;
};

// LP 목록 조회 응답 DTO
export type ResponseLpListDTO = CommonResponse<LpListData>;

// LP 상세 조회 응답 DTO
export type LpDetail = LpItem & {
  author: LpAuthor;
};

export type ResponseLpDetailDTO = CommonResponse<LpDetail>;
