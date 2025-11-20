import type { CommonResponse } from "./common";

export interface LikeDTO {
  id: number;
  userId: number;
  lpId: number;
}

export type ResponseLikeDTO = CommonResponse<LikeDTO>;
