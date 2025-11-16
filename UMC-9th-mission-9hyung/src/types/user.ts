import type { CommonResponse } from "./common";

export type User = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type RequestPatchUser = {
  name: string;
  bio?: string | null;
  avatar?: string | null;
};

export type ResponsePatchUser = CommonResponse<User>;

export type ResponseDeleteUser = CommonResponse<[]>;
