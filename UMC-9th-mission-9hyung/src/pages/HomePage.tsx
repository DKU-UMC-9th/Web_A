import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER, type PaginationOrder } from "../enums/common";
import type { LpItem } from "../types/lp";
import LpCard from "../components/LpCard";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";

const LpCardSkeleton = () => (
  <div className="animate-pulse
                  bg-neutral-200 dark:bg-neutral-700
                  aspect-square rounded-md
                  ring-1 ring-black/5 dark:ring-white/10 shadow-sm" />
);

const HomePage = () => {
  const navigate = useNavigate();

  // ✅ 정렬 상태: 기본 최신순
  const [sort, setSort] = useState<PaginationOrder>(PAGINATION_ORDER.desc);

  // ref, inView
  // ref -> 특정한 HTML 요소 감시 가능
  // inView -> 그 요소가 화면에 보이면 true
  // const { ref, inView } = useInView({
  //   threshold: 0,
  // })

  // const { data, isPending, isError, refetch } = useGetLpList({
  //   order: sort,
  //   limit: 50,
  // });

  const {
    data,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(20, "", sort);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [observerRef, hasNextPage, fetchNextPage]);

  // ✅ 정렬 변경 핸들러
  const handleSortChange = (order: PaginationOrder) => setSort(order);

  // ✅ 새 LP 작성 버튼 클릭 시 이동
  const handleAddClick = () => {
    navigate("/lps/new");
  };

  if (isPending) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
        {Array.from({ length: 20 }).map((_, index) => (
          <LpCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <span>데이터를 불러오는 데 실패했습니다.</span>
        <button
          //onClick={() => refetch()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="relative p-4">
      {/* ✅ 정렬 버튼 2개 */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => handleSortChange(PAGINATION_ORDER.desc)}
          className={`px-4 py-2 rounded-md font-semibold transition-colors ${
            sort === PAGINATION_ORDER.desc
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          최신순
        </button>
        <button
          onClick={() => handleSortChange(PAGINATION_ORDER.asc)}
          className={`px-4 py-2 rounded-md font-semibold transition-colors ${
            sort === PAGINATION_ORDER.asc
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          오래된순
        </button>
      </div>

      {/* LP 카드 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 데이터가 이미 로드된 카드들은 그대로 */}
        {data?.pages.map((page) =>
          page.data.data.map((lp: LpItem) => <LpCard key={lp.id} lp={lp} />)
        )}

        {/* ✅ 다음 페이지 로딩 시에만 하단 스켈레톤 20개 */}
        {isFetchingNextPage &&
          Array.from({ length: 20 }).map((_, i) => <LpCardSkeleton key={`sk-${i}`} />)}
      </div>

      {/* ✅ 옵저버 감시용 div */}
      <div
        ref={observerRef}
        className="h-10"
      />

      {/* ✅ 우측 하단 플로팅 버튼 */}
      <button
        onClick={handleAddClick}
        className="fixed bottom-8 right-8 flex items-center justify-center
                   w-14 h-14 rounded-full bg-blue-600 text-white text-3xl font-bold
                   shadow-lg hover:bg-blue-700 active:scale-95 transition-transform"
      >
        +
      </button>
    </div>
  );
};

export default HomePage;
