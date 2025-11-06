import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lps";
import { Heart, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function LpDetailPage() {
    const { lpId } = useParams<{ lpId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken } = useAuth();

    // 비로그인 사용자 체크
    useEffect(() => {
        if (!accessToken) {
            alert('로그인이 필요한 서비스입니다.');
            // 현재 경로를 저장하고 로그인 페이지로 이동
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/login');
        }
    }, [accessToken, location.pathname, navigate]);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['lp', lpId],
        queryFn: () => getLpDetail(Number(lpId)),
        enabled: !!lpId,
    });

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="p-8 text-white">
                <div className="max-w-4xl mx-auto">
                    {/* 스켈레톤 UI */}
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
                        <div className="aspect-video bg-gray-700 rounded mb-6"></div>
                        <div className="h-10 bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        </div>
                    </div>
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
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            돌아가기
                        </button>
                        <button
                            onClick={() => refetch()}
                            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const lp = data?.data;

    if (!lp) {
        return (
            <div className="p-8 text-white flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-400">LP를 찾을 수 없습니다.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                    돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 text-white">
            <div className="max-w-4xl mx-auto">
                {/* 썸네일 이미지 */}
                <div className="aspect-video w-full rounded-lg overflow-hidden mb-6">
                    <img
                        src={lp.thumbnail}
                        alt={lp.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* 제목 및 메타 정보 */}
                <div className="mb-6">
                    <h1 className="text-4xl font-bold mb-4">{lp.title}</h1>

                    <div className="flex items-center justify-between text-gray-400 mb-4">
                        <div className="flex items-center gap-4">
                            {/* 작성자 */}
                            <div className="flex items-center gap-2">
                                {lp.author.avatar ? (
                                    <img
                                        src={lp.author.avatar}
                                        alt={lp.author.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                        {lp.author.name[0]}
                                    </div>
                                )}
                                <span>{lp.author.name}</span>
                            </div>

                            {/* 업로드일 */}
                            <span>•</span>
                            <span>
                                {new Date(lp.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        {/* 좋아요 */}
                        <div className="flex items-center gap-2 text-pink-400">
                            <Heart className="w-5 h-5 fill-current" />
                            <span>{lp.likes?.length || 0}</span>
                        </div>
                    </div>

                    {/* 태그 */}
                    {lp.tags && lp.tags.length > 0 && (
                        <div className="flex gap-2 mb-4">
                            {lp.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-3 mb-8 pb-8 border-b border-gray-800">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
                    >
                        <Heart className="w-5 h-5" />
                        <span>좋아요</span>
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        <Edit className="w-5 h-5" />
                        <span>수정</span>
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span>삭제</span>
                    </button>
                </div>

                {/* 본문 내용 */}
                <div className="prose prose-invert max-w-none">
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {lp.content}
                    </div>
                </div>
            </div>
        </div>
    );
}
