import type { ResponseLpListDTO, ResponseLpDetailDTO } from "../types/lps";
import { axiosInstance } from "./axios";

export type SortOrder = "oldest" | "newest";

// LP 목록 조회
export const getLpList = async (sort: SortOrder = "newest"): Promise<ResponseLpListDTO> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: {
      sort: sort === "newest" ? "desc" : "asc"
    }
  });
  return data;
};

// LP 상세 조회
export const getLpDetail = async (lpId: number): Promise<ResponseLpDetailDTO> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
};
