import { PAGINATION_ORDER } from "../enums/common";

export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
};

export type CursorBasedResponse<T> ={
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
    nextCursor : number;
    hasNext: boolean;

};



export type PaginationDto={
    cursor?: number;
    limit?: number;
    search?: string;
    order?: typeof PAGINATION_ORDER[keyof typeof PAGINATION_ORDER];
// 결과: "asc" | "desc"
};