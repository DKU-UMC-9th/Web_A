import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLpList, type SortOrder } from "../apis/lps";
import SortButton from "../components/SortButton";
import LpCard from "../components/LpCard";

export default function HomePage() {
    const [sort, setSort] = useState<SortOrder>("newest");

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['lps', sort],
        queryFn: () => getLpList(sort),
    });

    const handleSortChange = (newSort: SortOrder) => {
        setSort(newSort);
    };

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="p-8 text-white">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">LP 목록</h1>
                    <SortButton onSortChange={handleSortChange} />
                </div>

                {/* 스켈레톤 UI */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg animate-pulse aspect-square"></div>
                    ))}
                </div>
            </div>
        );
    }

    // 에러 상태
    if (isError) {
        return (
            <div className="p-8 text-white flex flex-col items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-400">에러가 발생했습니다</h2>
                    <p className="text-gray-400 mb-6">
                        {error instanceof Error ? error.message : "데이터를 불러올 수 없습니다."}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    // 데이터 표시
    const lpList = data?.data?.data || [];

    return (
        <div className="p-16 text-white">
            {lpList.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                    등록된 LP가 없습니다.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {lpList.map((lp) => (
                        <LpCard key={lp.id} lp={lp} />
                    ))}
                </div>
            )}
        </div>
    );
}