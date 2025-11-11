import type { CursorBaseResponse } from "./common";

export type Tag ={
    id: number;
    name: string;
};

export type Likes={
    id:number;
    userId: number;
    lpId: number;
}

export type ResponseLpListDto = CursorBaseResponse<{
    data:{
        id: number;
        title: string;
        content: string;
        thumbnail: string;
        published: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        tags: Tag[];
        likes: Likes[];
    }
}>;