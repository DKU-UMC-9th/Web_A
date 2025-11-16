import { ResponseLpListDto, type RequestLpDto } from './../types/lp';
import { PaginationDto } from './../types/common';
import { axiosInstance} from './axios';
import { ResponseLpListDto } from '../types/lp';

export const getLpList = async(PaginationDto: PaginationDto,
):Promise<ResponseLpListDto> =>{
    const {data} = await axiosInstance.get("/v1/lps", {
        params: PaginationDto,
    })
    return data;
};


export const getLpDetail = async({lpId}:RequestLpDto):Promise<ResponseLpListDto>=>{
    const {data} = await axiosInstance.get("v1/lps/:lpId");

    return data;
}

export const postLike = async({lpId}: RequestLpDto)=>{
    const{data}=await axiosInstance.post('/v1/lps/${lpId}/likes');

    return data;
}

export const deleteLike= async({lpId}: RequestLpDto)=>{
    const{data}=await axiosInstance.post('/v1/lps/${lpId}/likes');

    return data;
}