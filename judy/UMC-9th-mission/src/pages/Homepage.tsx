import { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList, searchLps, type SortOrder } from "../apis/lps";
import SortButton from "../components/SortButton";
import LpCard from "../components/LpCard";
import LpCardSkeleton from "../components/LpCardSkeleton";
import SearchBar from "../components/SearchBar";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { useDebounce } from "../hooks/useDebounce";

export default function HomePage() {
    const [sort, setSort] = useState<SortOrder>("newest");
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchType, setSearchType] = useState<'title' | 'tag'>('title');
    const observerTarget = useRef<HTMLDivElement>(null);

    // 디바운스된 검색어 (300ms 지연)
    const debouncedSearchKeyword = useDebounce(searchKeyword, 300);

    // 검색어가 있는지 확인 (공백 제거 후)
    const hasSearchKeyword = debouncedSearchKeyword.trim().length > 0;

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
        // queryKey에 디바운스된 검색어 포함
        queryKey: hasSearchKeyword
            ? ['lps', 'search', debouncedSearchKeyword, searchType]
            : ['lps', sort],

        // 검색어가 있으면 검색 API, 없으면 일반 목록 API
        queryFn: ({ pageParam }) => {
            if (hasSearchKeyword) {
                return searchLps({
                    search: debouncedSearchKeyword.trim(),
                    type: searchType,
                    sort,
                    cursor: pageParam,
                });
            }
            return getLpList(sort, pageParam);
        },

        initialPageParam: undefined as number | undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },

        // 빈 검색어일 때는 항상 실행, 검색어가 있을 때만 조건부 실행
        enabled: !hasSearchKeyword || debouncedSearchKeyword.trim().length > 0,

        // 캐시 설정 최적화
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
    });

    const handleSortChange = (newSort: SortOrder) => {
        setSort(newSort);
    };

    const handleSearchChange = (keyword: string, type: 'title' | 'tag') => {
        setSearchKeyword(keyword);
        setSearchType(type);
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
            {/* 맨 위로 가기 버튼 (useThrottle 적용) */}
            <ScrollToTopButton />

            {/* 검색 바 */}
            <SearchBar
                onSearchChange={handleSearchChange}
                initialKeyword={searchKeyword}
                initialSearchType={searchType}
            />

            {/* 검색 중일 때와 일반 목록일 때 다른 UI */}
            {hasSearchKeyword ? (
                <div className="mb-6">
                    <p className="text-gray-400 text-sm">
                        "{debouncedSearchKeyword}" 검색 결과 ({searchType === 'title' ? '제목' : '태그'})
                    </p>
                </div>
            ) : (
                <div className="mb-6 flex justify-end">
                    <SortButton currentSort={sort} onSortChange={handleSortChange} />
                </div>
            )}

            {/* 초기 로딩 상태 - 상단 스켈레톤 */}
            {isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(12)].map((_, index) => (
                        <LpCardSkeleton key={index} />
                    ))}
                </div>
            )}

            {/* 데이터 표시 */}
            {!isLoading && lpList.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                    {hasSearchKeyword
                        ? "검색 결과가 없습니다."
                        : "등록된 LP가 없습니다."}
                </div>
            )}

            {!isLoading && lpList.length > 0 && (
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
