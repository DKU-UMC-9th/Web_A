import type { RequestSigninDTO, RequestSignupDTO, ResponseMyInfoDTO, ResponseSigninDTO, ResponseSignupDTO } from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDTO):Promise<ResponseSignupDTO> => {
    const { data } = await axiosInstance.post("/v1/auth/signup", body);

    return data;
};

export const postSignin = async (body: RequestSigninDTO):Promise<ResponseSigninDTO> => {
    const { data } = await axiosInstance.post("/v1/auth/signin",body,);

    return data;
}

export const postLogout = async (): Promise<void> => {
    await axiosInstance.post("/v1/auth/signout");
};

export const getMyInfo = async (): Promise<ResponseMyInfoDTO> => {
    const { data } = await axiosInstance.get("/v1/users/me");
    return data;
}

export const postRefreshToken = async (refreshToken: string): Promise<ResponseSigninDTO> => {
    const { data } = await axiosInstance.post("/v1/auth/refresh", {
        refresh: refreshToken
    });
    return data;
}