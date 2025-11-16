import type { ResponseLikeLpDto } from "../types/lpLikes"
import { axiosInstance } from "./axios"

export const postLike = async (
    lpId: number,
): Promise<ResponseLikeLpDto> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
    return data;
}

export const deleteLike = async (
    lpId: number,
) : Promise<ResponseLikeLpDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
    return data;
}