import type { PaginationDto } from "../types/common";
import type { RequestLpCreateDto, RequestLpUpdateDto, ResponseLpCreateDto, ResponseLpDeleteDto, ResponseLpDetailDto, ResponseLpListDto, ResponseLpUpdateDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpById = async (
  lpId: string,
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
}

export const getLpDetail = async (
  lpId: number,
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
}

export const postLpCreate = async (
  body: RequestLpCreateDto
) : Promise<ResponseLpCreateDto> => {
  const { data } = await axiosInstance.post("/v1/lps", body )
  return data;
}

// LP 정보 수정
export const patchLpUpdate = async (
  lpId: number,
  body: RequestLpUpdateDto
) : Promise<ResponseLpUpdateDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, body)
  return data;
}

// LP 정보 삭제
export const deleteLp = async (
  lpId: number
) : Promise<ResponseLpDeleteDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`)
  return data;
}

