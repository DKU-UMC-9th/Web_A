import { axiosInstance } from "./axios";

export interface User {
    id: number;
    email: string;
    name: string; // API에서 name으로 옴
    bio: string | null;
    avatar: string;
}

export const getMyInfo = async (): Promise<User> => {
    const { data } = await axiosInstance.get("/v1/users/me");
    return data.data;
};
