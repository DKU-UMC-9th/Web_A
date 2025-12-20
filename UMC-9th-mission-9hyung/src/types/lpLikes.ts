import type { CommonResponse } from "./common";

export type ResponseLikeLpDto = CommonResponse<{
    id: number;
    useId: number;
    lpId: number;
}>