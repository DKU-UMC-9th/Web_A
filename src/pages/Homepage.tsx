import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";


const HomePage = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState<"asc" | "desc">("desc"); // 기본값: 최신순(desc)
    
    const { data, isPending, isError, refetch } = useGetLpList({ order });
    
    const lpList = data || [];

    // 로딩 스켈레톤
    if (isPending) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">LP 목록</h2>
                    <div className="w-32 h-10 bg-gray-800 rounded-lg animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {[...Array(12)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="aspect-square bg-gray-800 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

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
            {/* 헤더 영역 - 정렬 버튼 */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">LP 목록 ({lpList.length}개)</h2>
                <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setOrder("desc")}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            order === "desc" 
                                ? "bg-white text-black font-medium" 
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        오래된순
                    </button>
                    <button
                        onClick={() => setOrder("asc")}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            order === "asc" 
                                ? "bg-white text-black font-medium" 
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        최신순
                    </button>
                </div>
            </div>

            {/* LP 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {lpList.map((lp: any) => (
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
            </div>

            {/* 데이터가 없을 때 */}
            {lpList.length === 0 && (
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🎵</div>
                        <p className="text-gray-500 text-lg">아직 LP가 없습니다.</p>
                        <p className="text-gray-600 text-sm mt-2">첫 번째 LP를 만들어보세요!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
