import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetCommentInfiniteList from "../hooks/queries/useGetCommentInfiniteList";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import type { Comment } from "../types/lp";
import { createComment } from "../apis/lp";
import { useQueryClient } from "@tanstack/react-query";

const LpDetailPage = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const commentObserverTarget = useRef<HTMLDivElement>(null);
    
    const { data: lp, isPending, isError, refetch } = useGetLpDetail(lpid || "");
    
    const {
        data: commentsData,
        isPending: isCommentsPending,
        fetchNextPage: fetchNextComments,
        hasNextPage: hasNextComments,
        isFetchingNextPage: isFetchingNextComments,
    } = useGetCommentInfiniteList({
        lpId: lpid || "",
        order: commentOrder,
        limit: 50, // 한 번에 50개씩 로드
    });
    
    const commentList: Comment[] = commentsData?.pages.flatMap(page => page.data.data) || [];

    // 비로그인 사용자 체크
    useEffect(() => {
        if (!accessToken) {
            setShowModal(true);
        }
    }, [accessToken]);

    // 댓글 무한 스크롤
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                console.log('댓글 Observer 트리거:', {
                    isIntersecting: entries[0].isIntersecting,
                    hasNextComments,
                    isFetchingNextComments
                });
                if (entries[0].isIntersecting && hasNextComments && !isFetchingNextComments) {
                    console.log('다음 댓글 페이지 로드 시작');
                    fetchNextComments();
                }
            },
            { threshold: 0.1, rootMargin: '100px' } // 100px 전에 미리 로드
        );

        const currentTarget = commentObserverTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNextComments, isFetchingNextComments, fetchNextComments]);

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
        // 현재 경로를 저장
        const currentPath = location.pathname;
        localStorage.setItem('redirectAfterLogin', currentPath);
        sessionStorage.setItem('redirectAfterLogin', currentPath);
        navigate('/login', { state: { location } });
    };

    // 댓글 작성
    const handleCommentSubmit = async () => {
        if (!commentText.trim() || commentText.length > 200 || !lpid) return;
        
        setIsSubmitting(true);
        try {
            await createComment(lpid, commentText.trim());
            setCommentText("");
            // 댓글 목록 새로고침
            queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
        } catch (error) {
            console.error("댓글 작성 실패:", error);
            alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
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

                {/* 댓글 섹션 */}
                <div className="mt-12 max-w-4xl mx-auto">
                    <div className="bg-gray-900 rounded-lg p-6">
                        {/* 댓글 헤더 */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                댓글 {!isCommentsPending && `(${commentList.length}개)`}
                            </h2>
                            <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
                                <button
                                    onClick={() => setCommentOrder("asc")}
                                    className={`px-3 py-1 rounded-md transition-colors text-sm ${
                                        commentOrder === "asc"
                                            ? "bg-white text-black font-medium"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    오래된순
                                </button>
                                <button
                                    onClick={() => setCommentOrder("desc")}
                                    className={`px-3 py-1 rounded-md transition-colors text-sm ${
                                        commentOrder === "desc"
                                            ? "bg-white text-black font-medium"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    최신순
                                </button>
                            </div>
                        </div>

                        {/* 댓글 작성란 */}
                        <div className="mb-6">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="댓글을 입력해주세요..."
                                className="w-full bg-gray-800 text-white rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                                rows={3}
                            />
                            {commentText.length > 0 && (
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="text-sm text-gray-400">
                                        {commentText.length > 200 ? (
                                            <span className="text-red-500">200자를 초과했습니다</span>
                                        ) : (
                                            <span>{commentText.length} / 200</span>
                                        )}
                                    </span>
                                    <button
                                        onClick={handleCommentSubmit}
                                        disabled={commentText.length === 0 || commentText.length > 200 || isSubmitting}
                                        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? "작성 중..." : "작성"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 댓글 목록 */}
                        <div className="space-y-4">
                            {/* 초기 로딩 스켈레톤 - 상단 */}
                            {isCommentsPending && (
                                <>
                                    {[...Array(3)].map((_, index) => (
                                        <div key={`comment-skeleton-${index}`} className="p-4 bg-gray-800 rounded-lg">
                                            <div className="flex gap-3">
                                                {/* 아바tar 스켈레톤 */}
                                                <div className="relative w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                                    <div 
                                                        className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
                                                        style={{
                                                            backgroundSize: '200% 100%',
                                                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite'
                                                        }}
                                                    ></div>
                                                </div>
                                                {/* 댓글 내용 스켈레톤 */}
                                                <div className="flex-1 space-y-2">
                                                    <div className="relative h-4 bg-gray-700 rounded w-24 overflow-hidden">
                                                        <div 
                                                            className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
                                                            style={{
                                                                backgroundSize: '200% 100%',
                                                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite'
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="relative h-4 bg-gray-700 rounded w-full overflow-hidden">
                                                        <div 
                                                            className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
                                                            style={{
                                                                backgroundSize: '200% 100%',
                                                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite'
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="relative h-3 bg-gray-700 rounded w-32 overflow-hidden">
                                                        <div 
                                                            className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
                                                            style={{
                                                                backgroundSize: '200% 100%',
                                                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite'
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* 실제 댓글 */}
                            {commentList.map((comment) => (
                                <div key={comment.id} className="flex gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                                    <div className="flex-shrink-0">
                                        {comment.author.avatar ? (
                                            <img
                                                src={comment.author.avatar}
                                                alt={comment.author.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                                                {comment.author.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-white">{comment.author.name}</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                    <button className="text-gray-500 hover:text-gray-300">⋮</button>
                                </div>
                            ))}

                            {/* 다음 페이지 로딩 스켈레톤 - 하단 */}
                            {isFetchingNextComments && (
                                <>
                                    {[...Array(2)].map((_, index) => (
                                        <div key={`comment-next-skeleton-${index}`} className="p-4 bg-gray-800 rounded-lg">
                                            <div className="flex gap-3">
                                                {/* 아바타 스켈레톤 */}
                                                <div className="relative w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                                    <div 
                                                        className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
                                                        style={{
                                                            backgroundSize: '200% 100%',
                                                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite'
                                                        }}
                                                    ></div>
                                                </div>
                                                {/* 댓글 내용 스켈레톤 */}
                                                <div className="flex-1 space-y-2">
                                                    <div className="relative h-4 bg-gray-700 rounded w-24 overflow-hidden">
                                                        <div 
                                                            className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
                                                            style={{
                                                                backgroundSize: '200% 100%',
                                                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite'
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="relative h-4 bg-gray-700 rounded w-full overflow-hidden">
                                                        <div 
                                                            className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
                                                            style={{
                                                                backgroundSize: '200% 100%',
                                                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite'
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* 무한 스크롤 트리거 */}
                            <div ref={commentObserverTarget} className="h-20" />

                            {/* 댓글 없음 */}
                            {!isCommentsPending && commentList.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="text-4xl mb-2">💬</div>
                                    <p>첫 번째 댓글을 작성해보세요!</p>
                                </div>
                            )}

                            {/* 더 이상 댓글 없음 */}
                            {!hasNextComments && commentList.length > 0 && (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    모든 댓글을 불러왔습니다
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LpDetailPage;
