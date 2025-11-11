import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";
import type { LpItem } from "../types/lp";
import LpCard from "../components/LpCard";

const LpCardSkeleton = () => (
  <div className="animate-pulse bg-gray-200 aspect-square rounded-md" />
);

const HomePage = () => {
  const navigate = useNavigate();

  // ✅ 정렬 상태: 기본 최신순
  const [sort, setSort] = useState(PAGINATION_ORDER.desc);

  const { data, isPending, isError, refetch } = useGetLpList({
    order: sort,
  });

  // ✅ 정렬 변경 핸들러
  const handleSortChange = (order: (typeof PAGINATION_ORDER)[keyof typeof PAGINATION_ORDER]) => {
    setSort(order);
  };

  // ✅ 새 LP 작성 버튼 클릭 시 이동
  const handleAddClick = () => {
    navigate("/lps/new");
  };

  if (isPending) {
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
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
          onClick={() => refetch()}
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
        {data?.data.data.map((lp: LpItem) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
      </div>

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
