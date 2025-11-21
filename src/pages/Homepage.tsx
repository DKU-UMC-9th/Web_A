import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpInfiniteList from "../hooks/queries/useGetLpInfiniteList";
import useDebounce from "../hooks/useDebounce";
import type { Lp } from "../types/lp";
import { FaSearch } from "react-icons/fa";


const HomePage = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState<"asc" | "desc">("desc"); // 기본값: 최신순(desc)
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 입력 상태
    const observerTarget = useRef<HTMLDivElement>(null);
    
    // useDebounce로 검색어 지연 처리 (300ms)
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    
    const { 
        data, 
        isPending, 
        isError, 
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetLpInfiniteList({ 
        order, 
        search: debouncedSearchTerm.trim(), // 디바운스된 검색어 사용
        limit: 20 
    });
    
    // 모든 페이지의 데이터를 flat하게 합침
    const lpList: Lp[] = data?.pages.flat() || [];

    // Intersection Observer로 무한 스크롤 구현
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
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    
    // 검색어 초기화
    const handleClearSearch = () => {
        setSearchTerm("");
    };

    // 스켈레톤 카드 컴포넌트
    const SkeletonCard = () => (
        <div className="group cursor-pointer transform transition-all duration-300">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800 shadow-lg">
                {/* 펄스 + 쉬머 애니메이션 */}
                <div 
                    className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse"
                    style={{
                        backgroundSize: '200% 100%',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite'
                    }}
                ></div>
            </div>
            <style>{`
                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }
            `}</style>
        </div>
    );

    // 에러 상태
    if (isError) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😢</div>
                    <h2 className="text-2xl font-bold mb-4">데이터를 불러오는데 실패했습니다</h2>
                    <p className="text-gray-400 mb-6">네트워크 연결을 확인하고 다시 시도해주세요.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            {/* 헤더 영역 */}
            <div className="mb-6 space-y-4">
                {/* 검색바 */}
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="LP 제목이나 내용으로 검색하세요"
                            className="w-full px-6 py-4 pl-14 bg-gray-900 text-white rounded-full border-2 border-gray-700 focus:border-pink-500 focus:outline-none transition-colors placeholder-gray-500"
                        />
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {/* 디바운스 안내 */}
                    {searchTerm && searchTerm !== debouncedSearchTerm && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            입력 중... (300ms 후 검색)
                        </p>
                    )}
                </div>

                {/* 결과 카운트 및 정렬 버튼 */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        {debouncedSearchTerm ? (
                            <>
                                '<span className="text-pink-500">{debouncedSearchTerm}</span>' 검색 결과 ({lpList.length}개)
                            </>
                        ) : (
                            <>LP 목록 ({lpList.length}개)</>
                        )}
                    </h2>
                    <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setOrder("asc")}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                order === "asc" 
                                    ? "bg-white text-black font-medium" 
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            오래된순
                        </button>
                        <button
                            onClick={() => setOrder("desc")}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                order === "desc" 
                                    ? "bg-white text-black font-medium" 
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            최신순
                        </button>
                    </div>
                </div>
            </div>

            {/* LP 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {/* 초기 로딩 - 상단에 스켈레톤 표시 */}
                {isPending && (
                    <>
                        {[...Array(12)].map((_, index) => (
                            <SkeletonCard key={`skeleton-initial-${index}`} />
                        ))}
                    </>
                )}

                {/* 실제 LP 데이터 */}
                {lpList.map((lp: Lp) => (
                    <div
                        key={lp.id}
                        onClick={() => navigate(`/lp/${lp.id}`)}
                        className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                    >
                        {/* 앨범 커버 이미지 */}
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800 shadow-lg">
                            <img
                                src={lp.thumbnail}
                                alt={lp.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/300x300/444/fff?text=No+Image";
                                }}
                            />
                            {/* 호버 시 어두운 오버레이 */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* 호버 시 메타 정보 표시 */}
                            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 -m-4">
                                    <h3 className="text-white font-bold text-base mb-2 truncate">
                                        {lp.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm">
                                        <p className="text-gray-300">
                                            {new Date(lp.createdAt).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-pink-400 font-semibold flex items-center gap-1">
                                            <span>❤️</span>
                                            <span>{lp.likes?.length || 0}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* 다음 페이지 로딩 - 하단에 스켈레톤 표시 */}
                {isFetchingNextPage && (
                    <>
                        {[...Array(6)].map((_, index) => (
                            <SkeletonCard key={`skeleton-next-${index}`} />
                        ))}
                    </>
                )}
            </div>

            {/* 데이터가 없을 때 */}
            {lpList.length === 0 && !isPending && (
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="text-6xl mb-4">{debouncedSearchTerm ? "🔍" : "🎵"}</div>
                        {debouncedSearchTerm ? (
                            <>
                                <p className="text-gray-500 text-lg">'{debouncedSearchTerm}' 검색 결과가 없습니다.</p>
                                <p className="text-gray-600 text-sm mt-2">다른 검색어로 시도해보세요.</p>
                                <button
                                    onClick={handleClearSearch}
                                    className="mt-4 px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
                                >
                                    전체 목록 보기
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-500 text-lg">아직 LP가 없습니다.</p>
                                <p className="text-gray-600 text-sm mt-2">첫 번째 LP를 만들어보세요!</p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* 무한 스크롤 트리거 */}
            <div ref={observerTarget} className="h-10" />

            {/* 더 이상 데이터 없음 */}
            {!hasNextPage && lpList.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                    모든 LP를 불러왔습니다 🎉
                </div>
            )}
        </div>
    );
};

export default HomePage;
