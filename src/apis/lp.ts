import type { PaginationDto } from "../types/common";
import type { Lp } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto): Promise<Lp[]> => {
    const { data } = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    });

    // API 응답: { status, statusCode, message, data: { data: [...] } }
    // data.data.data를 반환
    return data.data.data;
};

// LP 상세 조회
export const getLpDetail = async (lpId: string): Promise<Lp> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
    
    // API 응답: { status, statusCode, message, data: { ... } }
    return data.data;
};
