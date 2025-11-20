import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationOrder } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(
  
  search: string | null,
  order: PaginationOrder,
  limit: number,
) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, limit, search: search ?? "", order }),
    queryKey: [QUERY_KEY.lps, {search: search ?? "", order}],
    initialPageParam: 0,
    //enabled: search !== null && search.trim() !== "",
    getNextPageParam: (lastPage, allPages) => {
      console.log(lastPage, allPages);
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLpList;
