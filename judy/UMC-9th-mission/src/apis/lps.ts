import type { ResponseLpListDTO, ResponseLpDetailDTO, ResponseDeleteLpDTO } from "../types/lps";
import { axiosInstance } from "./axios";

export type SortOrder = "oldest" | "newest";

// LP 목록 조회
export const getLpList = async (sort: SortOrder = "newest", cursor?: number): Promise<ResponseLpListDTO> => {
  const sortParam = sort === "newest" ? "desc" : "asc";

  const { data } = await axiosInstance.get("/v1/lps", {
    params: {
      sort: sortParam,
      ...(cursor && { cursor })
    }
  });

  return data;
};

// LP 상세 조회
export const getLpDetail = async (lpId: number): Promise<ResponseLpDetailDTO> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
};

// LP 생성
export const createLp = async (lpData: {
  title: string;
  content: string;
  tags: string[];
  thumbnail?: string;
}): Promise<ResponseLpDetailDTO> => {
  const payload = {
    title: lpData.title,
    content: lpData.content,
    tags: lpData.tags,
    thumbnail: lpData.thumbnail || "",
    published: true
  };

  const { data } = await axiosInstance.post("/v1/lps", payload);
  return data;
};

// LP 수정
export const updateLp = async (
  lpId: number,
  lpData: {
    title: string;
    content: string;
    thumbnail?: string;
    tags: string[];
    published: boolean;
  }
): Promise<ResponseLpDetailDTO> => {
  const payload = {
    title: lpData.title,
    content: lpData.content,
    thumbnail: lpData.thumbnail || "",
    tags: lpData.tags,
    published: lpData.published,
  };

  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, payload);
  return data;
};

// LP 삭제
export const deleteLp = async (lpId: number): Promise<ResponseDeleteLpDTO> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

