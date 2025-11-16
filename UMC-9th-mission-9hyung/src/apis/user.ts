import type { RequestPatchUser, ResponseDeleteUser, ResponsePatchUser } from "../types/user";
import { axiosInstance } from "./axios";

export const patchUserInfo = async (
    body: RequestPatchUser
): Promise<ResponsePatchUser> => {
    const { data } = await axiosInstance.patch("/v1/users", body);
    return data;
}

export const deleteUser = async () : Promise<ResponseDeleteUser> => {
    const { data } = await axiosInstance.delete("/v1/users");
    return data;
}