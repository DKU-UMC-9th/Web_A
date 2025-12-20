import type { CommonResponse, CursorBasedResponse } from "./common";

// 태그
export type Tag = {
  id: number;
  name: string;
};

// 좋아요!
export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

// 작성자 정보 
export type LpAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

// LP 단일 아이템
export type LpItem = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  likes: Likes[];
};

// LP 목록 조회 데이터 구조
export type LpListData = {
  data: LpItem[];
  nextCursor: number;
  hasNext: boolean;
}

// LP 목록 조회 응답 Dto
export type ResponseLpListDto = CommonResponse<LpListData>;

// LP 상세 조회 응답 Dto
export type LpDetail = LpItem & {
  author: LpAuthor;
}

// LP 상세 조회 응답 Dto
export type ResponseLpDetailDto = CommonResponse<LpDetail>;

// LP 상세 조회 요청 Dto
export type RequestLpDto = {
  lpId: number;
}

// LP 생성 요청 Dto
export type RequestLpCreateDto = {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

// LP 생성 응답 Dto
export type ResponseLpCreateDto = CommonResponse<LpItem>;

// LP 정보 수정 요청 Dto
export type RequestLpUpdateDto = RequestLpCreateDto;

// LP 정보 수정 응답 Dto
export type ResponseLpUpdateDto = CommonResponse<{
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}>

// LP 삭제 응답 Dto
export type ResponseLpDeleteDto = CommonResponse<[]>


