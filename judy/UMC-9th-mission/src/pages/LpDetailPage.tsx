import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLpDetail, deleteLp, updateLp } from "../apis/lps";
import { getComments, postComment, patchComment, deleteComment } from "../apis/comments";
import { getMyInfo } from "../apis/auth";
import { Heart, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef, useMemo } from "react";
import CommentSection from "../components/CommentSection";
import CommentCard from "../components/CommentCard";
import CommentSkeleton from "../components/CommentSkeleton";
import EditLpModal from "../components/EditLpModal";
import { useLikeLp } from "../hooks/useLikeLp";

export default function LpDetailPage() {
    const { lpId } = useParams<{ lpId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken } = useAuth();
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const commentObserverTarget = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // 비로그인 사용자 체크
    useEffect(() => {
        if (!accessToken) {
            alert('로그인이 필요한 서비스입니다.');
            // 현재 경로를 저장하고 로그인 페이지로 이동
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/login');
        }
    }, [accessToken, location.pathname, navigate]);

    // LP 상세 정보 조회
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['lp', lpId],
        queryFn: () => getLpDetail(Number(lpId)),
        enabled: !!lpId,
    });

    // 현재 사용자 정보 조회
    const { data: userInfo } = useQuery({
        queryKey: ['user', 'me'],
        queryFn: getMyInfo,
        enabled: !!accessToken,
    });

    // 댓글 목록 조회 (useInfiniteQuery)
    const {
        data: commentsData,
        isLoading: isCommentsLoading,
        isError: isCommentsError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['lpComments', lpId, order],
        queryFn: ({ pageParam }) => getComments(Number(lpId), pageParam, undefined, order),
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
        enabled: !!lpId,
    });

    // 댓글 정렬 변경 핸들러
    const handleOrderChange = (newOrder: "asc" | "desc") => {
        setOrder(newOrder);
    };

    // 댓글 작성 mutation
    const createCommentMutation = useMutation({
        mutationFn: (content: string) => postComment(Number(lpId), { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
        },
        onError: (error) => {
            console.error('Failed to create comment:', error);
            alert('댓글 작성에 실패했습니다.');
        }
    });

    // 댓글 수정 mutation
    const updateCommentMutation = useMutation({
        mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
            patchComment(Number(lpId), commentId, { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
        },
        onError: (error) => {
            console.error('Failed to update comment:', error);
            alert('댓글 수정에 실패했습니다.');
        }
    });

    // 댓글 삭제 mutation
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: number) => deleteComment(Number(lpId), commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
        },
        onError: (error) => {
            console.error('Failed to delete comment:', error);
            alert('댓글 삭제에 실패했습니다.');
        }
    });

    const handleCreateComment = (content: string) => {
        createCommentMutation.mutate(content);
    };

    const handleUpdateComment = (commentId: number, content: string) => {
        updateCommentMutation.mutate({ commentId, content });
    };

    const handleDeleteComment = (commentId: number) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            deleteCommentMutation.mutate(commentId);
        }
    };

    // LP 삭제 mutation
    const deleteLpMutation = useMutation({
        mutationFn: () => deleteLp(Number(lpId)),
        onSuccess: () => {
            alert('LP가 삭제되었습니다.');
            navigate('/');
        },
        onError: (error) => {
            console.error('Failed to delete LP:', error);
            alert('LP 삭제에 실패했습니다.');
        }
    });

    const handleDeleteLp = () => {
        if (window.confirm('정말로 이 LP를 삭제하시겠습니까?')) {
            deleteLpMutation.mutate();
        }
    };

    // LP 수정 mutation
    const updateLpMutation = useMutation({
        mutationFn: (data: { title: string; content: string; tags: string[]; thumbnail?: string }) =>
            updateLp(Number(lpId), {
                title: data.title,
                content: data.content,
                tags: data.tags,
                thumbnail: data.thumbnail,
                published: true
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
            setIsEditModalOpen(false);
            alert('LP가 수정되었습니다.');
        },
        onError: (error) => {
            console.error('Failed to update LP:', error);
            alert('LP 수정에 실패했습니다.');
        }
    });

    const handleEditLp = () => {
        setIsEditModalOpen(true);
    };

    const handleUpdateLp = (data: { title: string; content: string; tags: string[]; thumbnail?: string }) => {
        updateLpMutation.mutate(data);
    };

    // 좋아요 mutation
    const likeLpMutation = useLikeLp({
        lpId: Number(lpId),
        userId: userInfo?.data?.id,
    });

    // 현재 사용자가 좋아요를 눌렀는지 확인
    const isLiked = useMemo(() => {
        if (!userInfo?.data?.id || !data?.data?.likes) return false;
        return data.data.likes.some((like) => like.userId === userInfo.data.id);
    }, [userInfo?.data?.id, data?.data?.likes]);

    const handleLikeToggle = () => {
        if (!accessToken) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }
        likeLpMutation.mutate({ isLiked });
    };

    // IntersectionObserver로 댓글 무한 스크롤
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
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
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
                        onClick={handleLikeToggle}
                        disabled={likeLpMutation.isPending}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            isLiked
                                ? 'bg-pink-500 hover:bg-pink-600'
                                : 'bg-gray-700 hover:bg-gray-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{isLiked ? '좋아요 취소' : '좋아요'}</span>
                    </button>
                    {/* 본인 LP일 때만 수정/삭제 버튼 표시 */}
                    {userInfo?.data?.id === lp.authorId && (
                        <>
                            <button
                                onClick={handleEditLp}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                <Edit className="w-5 h-5" />
                                <span>수정</span>
                            </button>
                            <button
                                onClick={handleDeleteLp}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span>삭제</span>
                            </button>
                        </>
                    )}
                </div>

                {/* 본문 내용 */}
                <div className="prose prose-invert max-w-none mb-12">
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {lp.content}
                    </div>
                </div>

                {/* 댓글 섹션 */}
                <div className="border-t border-gray-800 pt-8">
                    <CommentSection
                        order={order}
                        onOrderChange={handleOrderChange}
                        onSubmit={handleCreateComment}
                    />

                    {/* 댓글 목록 */}
                    <div className="mt-6 space-y-4">
                        {/* 초기 로딩 상태 - 상단 스켈레톤 */}
                        {isCommentsLoading && (
                            <>
                                {[...Array(5)].map((_, index) => (
                                    <CommentSkeleton key={index} />
                                ))}
                            </>
                        )}

                        {/* 댓글 에러 상태 */}
                        {isCommentsError && (
                            <div className="text-center text-gray-400 py-8">
                                댓글을 불러오는데 실패했습니다.
                            </div>
                        )}

                        {/* 댓글 데이터 표시 */}
                        {!isCommentsLoading && commentsData && (
                            <>
                                {commentsData.pages.flatMap((page) => page.data.data).length === 0 ? (
                                    <div className="text-center text-gray-400 py-8">
                                        첫 댓글을 작성해보세요!
                                    </div>
                                ) : (
                                    <>
                                        {commentsData.pages.flatMap((page) => page.data.data).map((comment) => (
                                            <CommentCard
                                                key={comment.id}
                                                comment={comment}
                                                currentUserId={userInfo?.data?.id}
                                                onUpdate={handleUpdateComment}
                                                onDelete={handleDeleteComment}
                                            />
                                        ))}

                                        {/* 다음 페이지 로딩 상태 - 하단 스켈레톤 */}
                                        {isFetchingNextPage && (
                                            <>
                                                {[...Array(3)].map((_, index) => (
                                                    <CommentSkeleton key={index} />
                                                ))}
                                            </>
                                        )}

                                        {/* IntersectionObserver 타겟 */}
                                        <div ref={commentObserverTarget} className="h-10" />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit LP Modal */}
            {lp && (
                <EditLpModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdateLp}
                    initialData={{
                        title: lp.title,
                        content: lp.content,
                        tags: lp.tags,
                        thumbnail: lp.thumbnail
                    }}
                />
            )}
        </div>
    );
}
