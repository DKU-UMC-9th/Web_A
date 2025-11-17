import { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Comment } from "../types/lp";
import { useCommentMutations } from "../hooks/useCommentMutations";
import useGetCommentInfiniteList from "../hooks/queries/useGetCommentInfiniteList";

interface CommentSectionProps {
    lpid: string;
    myInfo?: { id: number };
}

export default function CommentSection({ lpid, myInfo }: CommentSectionProps) {
    const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
    const [commentText, setCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingCommentText, setEditingCommentText] = useState("");
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const commentObserverTarget = useRef<HTMLDivElement>(null);

    const {
        data: commentsData,
        isPending: isCommentsPending,
        fetchNextPage: fetchNextComments,
        hasNextPage: hasNextComments,
        isFetchingNextPage: isFetchingNextComments,
    } = useGetCommentInfiniteList({
        lpId: lpid,
        order: commentOrder,
        limit: 50,
    });

    const commentList: Comment[] = commentsData?.pages.flatMap(page => page.data.data) || [];

    const {
        createCommentMutation,
        updateCommentMutation,
        deleteCommentMutation,
    } = useCommentMutations(lpid);

    // 댓글 무한 스크롤
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextComments && !isFetchingNextComments) {
                    fetchNextComments();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
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

    // 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = () => {
            if (openMenuId !== null) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openMenuId]);

    const handleCommentSubmit = () => {
        if (!commentText.trim() || commentText.length > 200) return;
        createCommentMutation.mutate(commentText.trim(), {
            onSuccess: () => setCommentText(""),
        });
    };

    const handleEditStart = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.content);
        setOpenMenuId(null);
    };

    const handleEditCancel = () => {
        setEditingCommentId(null);
        setEditingCommentText("");
    };

    const handleEditSubmit = (commentId: number) => {
        if (!editingCommentText.trim() || editingCommentText.length > 200) return;
        updateCommentMutation.mutate(
            { commentId, content: editingCommentText.trim() },
            {
                onSuccess: () => {
                    setEditingCommentId(null);
                    setEditingCommentText("");
                },
            }
        );
    };

    const handleDeleteComment = (commentId: number) => {
        if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
            deleteCommentMutation.mutate(commentId);
        }
        setOpenMenuId(null);
    };

    return (
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
                                disabled={commentText.length === 0 || commentText.length > 200 || createCommentMutation.isPending}
                                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                            >
                                {createCommentMutation.isPending ? "작성 중..." : "작성"}
                            </button>
                        </div>
                    )}
                </div>

                {/* 댓글 목록 */}
                <div className="space-y-4">
                    {/* 로딩 스켈레톤 */}
                    {isCommentsPending && (
                        <>
                            {[...Array(3)].map((_, index) => (
                                <div key={`skeleton-${index}`} className="p-4 bg-gray-800 rounded-lg animate-pulse">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-700 rounded w-24"></div>
                                            <div className="h-4 bg-gray-700 rounded w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* 실제 댓글 */}
                    {commentList.map((comment) => {
                        const isMyComment = myInfo?.id === comment.authorId;
                        const isEditing = editingCommentId === comment.id;

                        return (
                            <div key={comment.id} className="flex gap-3 p-4 bg-gray-800 rounded-lg">
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
                                        {isMyComment && <span className="text-xs text-pink-400">(내 댓글)</span>}
                                    </div>

                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editingCommentText}
                                                onChange={(e) => setEditingCommentText(e.target.value)}
                                                className="w-full bg-gray-700 text-white rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                rows={2}
                                                maxLength={200}
                                            />
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">
                                                    {editingCommentText.length} / 200
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleEditCancel}
                                                        className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded"
                                                    >
                                                        취소
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditSubmit(comment.id)}
                                                        disabled={!editingCommentText.trim() || editingCommentText.length > 200}
                                                        className="px-3 py-1 text-xs bg-pink-500 hover:bg-pink-600 text-white rounded disabled:bg-gray-600"
                                                    >
                                                        수정
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.content}</p>
                                    )}
                                </div>

                                {isMyComment && !isEditing && (
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === comment.id ? null : comment.id);
                                            }}
                                            className="text-gray-500 hover:text-gray-300 p-1"
                                        >
                                            ⋮
                                        </button>
                                        {openMenuId === comment.id && (
                                            <div className="absolute right-0 top-8 bg-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[100px]">
                                                <button
                                                    onClick={() => handleEditStart(comment)}
                                                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-600 flex items-center gap-2"
                                                >
                                                    <FaEdit size={12} />
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-600 flex items-center gap-2"
                                                >
                                                    <FaTrash size={12} />
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* 무한 스크롤 트리거 */}
                    <div ref={commentObserverTarget} className="h-20" />

                    {/* 댓글 없음 */}
                    {!isCommentsPending && commentList.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-4xl mb-2">💬</div>
                            <p>첫 번째 댓글을 작성해보세요!</p>
                        </div>
                    )}

                    {!hasNextComments && commentList.length > 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                            모든 댓글을 불러왔습니다
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
