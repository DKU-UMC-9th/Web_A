import { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList, type SortOrder } from "../apis/lps";
import SortButton from "../components/SortButton";
import LpCard from "../components/LpCard";
import LpCardSkeleton from "../components/LpCardSkeleton";

export default function HomePage() {
    const [sort, setSort] = useState<SortOrder>("newest");
    const observerTarget = useRef<HTMLDivElement>(null);

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['lps', sort],
        queryFn: ({ pageParam }) => getLpList(sort, pageParam),
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
    });

    const handleSortChange = (newSort: SortOrder) => {
        setSort(newSort);
    };

    // IntersectionObserver로 무한 스크롤 트리거
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

    // 모든 페이지의 데이터를 평탄화
    const lpList = data?.pages.flatMap((page) => page.data.data) || [];

    return (
        <div className="p-16 text-white">
            {/* 정렬 버튼 */}
            <div className="mb-6 flex justify-end">
                <SortButton onSortChange={handleSortChange} />
            </div>

            {/* 초기 로딩 상태 - 상단 스켈레톤 */}
            {isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(12)].map((_, index) => (
                        <LpCardSkeleton key={index} />
                    ))}
                </div>
            )}

            {/* 데이터 표시 */}
            {!isLoading && lpList.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                    등록된 LP가 없습니다.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {lpList.map((lp) => (
                            <LpCard key={lp.id} lp={lp} />
                        ))}
                    </div>

                    {/* 다음 페이지 로딩 상태 - 하단 스켈레톤 */}
                    {isFetchingNextPage && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                            {[...Array(4)].map((_, index) => (
                                <LpCardSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {/* IntersectionObserver 타겟 */}
                    <div ref={observerTarget} className="h-10" />
                </>
            )}
        </div>
    );
}