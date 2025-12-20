import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import LpCard from "../components/LpCard";
import type { LpItem } from "../types/lp";
import useDebounce from "../hooks/useDebounce";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const shouldSearch = debouncedSearch.trim().length > 0;

  //const search = params.get("q") ?? "";
  const order = (params.get("order") ?? "desc") as "asc" | "desc";

  const { data, fetchNextPage, hasNextPage, isFetched } = useGetInfiniteLpList(
    shouldSearch ? debouncedSearch : "",
    order,
    20,
  );

  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
        setParams({ q: debouncedSearch, order });
    }
  }, [debouncedSearch])

  return (
    <div className="w-full flex flex-col items-center  mt-10">
      {/* 🔍 네이버 스타일 대형 검색창 */}
      <div className="w-full max-w-4xl mb-10 ">
        <SearchBar
          search={search}
          setSearch={setSearch}
          large={true}
        />
      </div>

      {/* 1) 검색어가 없을 때 */}
      {!shouldSearch && (
        <p className="text-gray-400 mt-10 text-lg font-semibold">무엇이 나올까요~?</p>
      )}

      {/* 2) 검색어는 있는데 결과는 아직 없고 로딩 전 */}
      {shouldSearch && isFetched && data?.pages[0].data.data.length === 0 && (
        <p className="text-gray-400 mt-10 text-lg">검색 결과가 없습니다.</p>
      )}
      {/* 🔥 LP 리스트 */}
      {shouldSearch && data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 w-full max-w-5xl">
          {data?.pages.map((page) =>
            page.data.data.map((lp: LpItem) => (
              <LpCard
                key={lp.id}
                lp={lp}
              />
            )),
          )}
        </div>
      )}
      {/* 추가 로딩 버튼 */}
      {/* {hasNextPage && <button onClick={() => fetchNextPage()}>더 보기</button>} */}
    </div>
  );
}
