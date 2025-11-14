import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

const LpDetailPage = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const { data: lp, isPending, isError, refetch } = useGetLpDetail(lpid || "");

    // 비로그인 사용자 체크
    useEffect(() => {
        if (!accessToken) {
            setShowModal(true);
        }
    }, [accessToken]);

    // 로딩 스켈레톤
    if (isPending) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="max-w-4xl mx-auto">
                    {/* 뒤로가기 버튼 스켈레톤 */}
                    <div className="w-24 h-10 bg-gray-800 rounded-lg mb-6 animate-pulse"></div>
                    
                    {/* LP 이미지 스켈레톤 */}
                    <div className="aspect-square max-w-md mx-auto bg-gray-800 rounded-lg mb-8 animate-pulse"></div>
                    
                    {/* 제목 스켈레톤 */}
                    <div className="h-10 bg-gray-800 rounded w-2/3 mb-4 animate-pulse"></div>
                    
                    {/* 메타 정보 스켈레톤 */}
                    <div className="flex gap-4 mb-6">
                        <div className="h-6 bg-gray-800 rounded w-32 animate-pulse"></div>
                        <div className="h-6 bg-gray-800 rounded w-24 animate-pulse"></div>
                    </div>
                    
                    {/* 버튼들 스켈레톤 */}
                    <div className="flex gap-3 mb-8">
                        <div className="h-12 bg-gray-800 rounded w-32 animate-pulse"></div>
                        <div className="h-12 bg-gray-800 rounded w-24 animate-pulse"></div>
                        <div className="h-12 bg-gray-800 rounded w-24 animate-pulse"></div>
                    </div>
                    
                    {/* 본문 스켈레톤 */}
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (isError || !lp) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😢</div>
                    <h2 className="text-2xl font-bold mb-4">LP를 불러오는데 실패했습니다</h2>
                    <p className="text-gray-400 mb-6">네트워크 연결을 확인하고 다시 시도해주세요.</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            뒤로가기
                        </button>
                        <button
                            onClick={() => refetch()}
                            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isLiked = false; // TODO: 좋아요 상태 관리

    // 로그인 페이지로 이동
    const handleLoginRedirect = () => {
        // 현재 경로를 state로 전달
        console.log('LpDetailPage - 현재 location:', location);
        console.log('LpDetailPage - 전달할 pathname:', location.pathname);
        navigate('/login', { state: { location } });
    };

    // 비로그인 경고 모달
    if (showModal) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-white mb-4">로그인이 필요한 서비스입니다</h2>
                    <p className="text-gray-400 mb-6">LP 상세 정보를 보려면 로그인해주세요.</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleLoginRedirect}
                            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
                        >
                            로그인하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-6xl w-full">
                {/* 뒤로가기 버튼 */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 mb-4 text-gray-400 hover:text-white transition-colors"
                >
                    <FaArrowLeft />
                    <span>뒤로가기</span>
                </button>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* 왼쪽: LP 썸네일 이미지 */}
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
                        <img
                            src={lp.thumbnail}
                            alt={lp.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/500x500/444/fff?text=No+Image";
                            }}
                        />
                    </div>

                    {/* 오른쪽: LP 정보 섹션 */}
                    <div className="space-y-4">
                        {/* 제목 */}
                        <h1 className="text-3xl md:text-4xl font-bold">{lp.title}</h1>

                        {/* 메타 정보 */}
                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                            <div className="flex items-center gap-2">
                                <span>업로드일</span>
                                <span className="text-white">
                                    {new Date(lp.createdAt).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-pink-400">❤️</span>
                                <span className="text-white font-semibold">{lp.likes?.length || 0}</span>
                            </div>
                        </div>

                        {/* 태그 */}
                        {lp.tags && lp.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {lp.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* 본문 내용 */}
                        <div className="py-4">
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                                {lp.content || "등록된 내용이 없습니다."}
                            </p>
                        </div>

                        {/* 액션 버튼들 */}
                        <div className="flex gap-2 pt-4 border-t border-gray-800">
                            {/* 좋아요 버튼 */}
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${
                                    isLiked
                                        ? "bg-pink-500 hover:bg-pink-600 text-white"
                                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                                }`}
                            >
                                {isLiked ? <FaHeart /> : <FaRegHeart />}
                                <span>좋아요</span>
                            </button>

                            {/* 수정 버튼 */}
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
                            >
                                <FaEdit />
                                <span>수정</span>
                            </button>

                            {/* 삭제 버튼 */}
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                            >
                                <FaTrash />
                                <span>삭제</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LpDetailPage;
