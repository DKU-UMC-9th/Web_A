import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { getLpComment } from "../../apis/lpComments";
import { QUERY_KEY } from "../../constants/key";
import { type ResponseCommnetListDto } from "../../types/lpComments";

export default function useGetLpComments(lpId: number, order: "asc" | "desc") {
  return useInfiniteQuery<
    ResponseCommnetListDto,
    Error,
    InfiniteData<ResponseCommnetListDto>,
    [string, number, string],
    number
  >({
    queryKey: [QUERY_KEY.lpComments, lpId, order],
    queryFn: ({ pageParam = 0 }) => getLpComment(lpId, pageParam, 5, order),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    initialPageParam: 0,
    enabled: !!lpId, // ✅ lpId가 존재할 때만 실행
  });
}
