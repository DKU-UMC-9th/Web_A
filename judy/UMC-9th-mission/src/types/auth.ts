import type { CommonResponse } from "./common";

// 회원가입
export type RequestSignupDTO = {
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    password: string;
}

export type ResponseSignupDTO = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;

// 로그인
export type RequestSigninDTO = {
    email: string;
    password: string;
};

export type ResponseSigninDTO = CommonResponse<{
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}>;

// 내 정보 조회
export type ResponseMyInfoDTO = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;

// 내 정보 수정
export type RequestUpdateMyInfoDTO = {
    name: string;
    bio?: string;
    avatar?: string;
};

export type ResponseUpdateMyInfoDTO = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;

// 회원 탈퇴
export type ResponseDeleteUserDTO = CommonResponse<null>;