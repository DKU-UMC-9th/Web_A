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

// 사용자 정보 수정
export interface UpdateUserDto {
    name?: string;
    bio?: string;
    avatar?: string;
}

export const updateMyInfo = async (updateData: UpdateUserDto): Promise<User> => {
    const { data } = await axiosInstance.patch("/v1/users", updateData);
    return data.data;
};
