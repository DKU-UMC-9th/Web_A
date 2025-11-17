import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import type { ChangeEvent } from "react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetCommentInfiniteList from "../hooks/queries/useGetCommentInfiniteList";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import type { Comment } from "../types/lp";
import { createComment, updateComment, deleteComment, updateLp, deleteLp, uploadImage } from "../apis/lp";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const LpDetailPage = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
    const [commentText, setCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingCommentText, setEditingCommentText] = useState("");
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const commentObserverTarget = useRef<HTMLDivElement>(null);
    
    // LP 수정 관련 상태
    const [isEditingLp, setIsEditingLp] = useState(false);
    const [editLpTitle, setEditLpTitle] = useState("");
    const [editLpContent, setEditLpContent] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const { data: lp, isPending, isError, refetch } = useGetLpDetail(lpid || "");
    const { data: myInfo } = useGetMyInfo();
    
    // 본인 LP 판별
    const isMyLp = myInfo?.id === lp?.authorId;
    
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

    // 댓글 작성 mutation
    const { mutate: createCommentMutation, isPending: isCreatingComment } = useMutation({
        mutationFn: (content: string) => createComment(lpid || "", content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
            setCommentText("");
        },
        onError: (error) => {
            console.error("댓글 작성 실패:", error);
            alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // 댓글 수정 mutation
    const { mutate: updateCommentMutation } = useMutation({
        mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
            updateComment(lpid || "", commentId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
            setEditingCommentId(null);
            setEditingCommentText("");
        },
        onError: (error) => {
            console.error("댓글 수정 실패:", error);
            alert("댓글 수정에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // 댓글 삭제 mutation
    const { mutate: deleteCommentMutation } = useMutation({
        mutationFn: (commentId: number) => deleteComment(lpid || "", commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
        },
        onError: (error) => {
            console.error("댓글 삭제 실패:", error);
            alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // 이미지 업로드 mutation
    const { mutate: uploadImageMutation, isPending: isUploadingImage } = useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            console.error("이미지 업로드 실패:", error);
            alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // LP 수정 mutation
    const { mutate: updateLpMutation, isPending: isUpdatingLp } = useMutation({
        mutationFn: ({ lpId, lpData }: { lpId: string; lpData: { title?: string; content?: string; thumbnail?: string; published?: boolean } }) => updateLp(lpId, lpData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lps", lpid] });
            queryClient.invalidateQueries({ queryKey: ["lps"] });
            setIsEditingLp(false);
            setImageFile(null);
            setImagePreview(null);
            alert("LP가 성공적으로 수정되었습니다! ✨");
        },
        onError: (error) => {
            console.error("LP 수정 실패:", error);
            alert("LP 수정에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // LP 삭제 mutation
    const { mutate: deleteLpMutation } = useMutation({
        mutationFn: (lpId: string) => deleteLp(lpId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lps"] });
            alert("LP가 삭제되었습니다.");
            navigate("/");
        },
        onError: (error) => {
            console.error("LP 삭제 실패:", error);
            alert("LP 삭제에 실패했습니다. 다시 시도해주세요.");
        },
    });

    const isPendingLpAction = isUploadingImage || isUpdatingLp;

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
    const handleCommentSubmit = () => {
        if (!commentText.trim() || commentText.length > 200 || !lpid) return;
        createCommentMutation(commentText.trim());
    };

    // 댓글 수정 시작
    const handleEditStart = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.content);
        setOpenMenuId(null);
    };

    // 댓글 수정 취소
    const handleEditCancel = () => {
        setEditingCommentId(null);
        setEditingCommentText("");
    };

    // 댓글 수정 제출
    const handleEditSubmit = (commentId: number) => {
        if (!editingCommentText.trim() || editingCommentText.length > 200) return;
        updateCommentMutation({ commentId, content: editingCommentText.trim() });
    };

    // 댓글 삭제
    const handleDeleteComment = (commentId: number) => {
        if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
            deleteCommentMutation(commentId);
        }
        setOpenMenuId(null);
    };

    // LP 수정 시작
    const handleLpEditStart = () => {
        setIsEditingLp(true);
        setEditLpTitle(lp?.title || "");
        setEditLpContent(lp?.content || "");
        setImagePreview(lp?.thumbnail || null);
    };

    // LP 수정 취소
    const handleLpEditCancel = () => {
        setIsEditingLp(false);
        setImageFile(null);
        setImagePreview(null);
    };

    // 이미지 변경
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("이미지 파일만 업로드 가능합니다.");
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
                alert("이미지 크기는 10MB 이하여야 합니다.");
                return;
            }

            setImageFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // LP 수정 제출
    const handleLpEditSubmit = () => {
        if (!editLpTitle.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!editLpContent.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        const updateData = {
            title: editLpTitle.trim(),
            content: editLpContent.trim(),
            published: true,
        };

        // 새 이미지 파일이 있으면 업로드
        if (imageFile) {
            uploadImageMutation(imageFile, {
                onSuccess: (imageUrl) => {
                    updateLpMutation({
                        lpId: lpid || "",
                        lpData: {
                            ...updateData,
                            thumbnail: imageUrl,
                        },
                    });
                },
            });
        } else {
            // 이미지 변경 없음
            updateLpMutation({
                lpId: lpid || "",
                lpData: updateData,
            });
        }
    };

    // LP 삭제
    const handleLpDelete = () => {
        if (window.confirm("정말 이 LP를 삭제하시겠습니까? 삭제된 LP는 복구할 수 없습니다.")) {
            deleteLpMutation(lpid || "");
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
                            src={imagePreview || lp.thumbnail}
                            alt={lp.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/500x500/444/fff?text=No+Image";
                            }}
                        />
                        {/* 수정 중 표시 */}
                        {isEditingLp && imagePreview && imagePreview !== lp.thumbnail && (
                            <div className="absolute top-2 right-2 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                미리보기
                            </div>
                        )}
                    </div>

                    {/* 오른쪽: LP 정보 섹션 */}
                    <div className="space-y-4">
                        {isEditingLp ? (
                            /* 수정 모드 */
                            <>
                                {/* 제목 입력 */}
                                <input
                                    type="text"
                                    value={editLpTitle}
                                    onChange={(e) => setEditLpTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 text-white text-3xl font-bold rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                                    placeholder="제목을 입력하세요"
                                    maxLength={100}
                                />

                                {/* 내용 입력 */}
                                <textarea
                                    value={editLpContent}
                                    onChange={(e) => setEditLpContent(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 resize-none"
                                    placeholder="내용을 입력하세요"
                                    rows={6}
                                    maxLength={1000}
                                />

                                {/* 이미지 변경 버튼 */}
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                                    >
                                        📷 이미지 변경
                                    </button>
                                    {imageFile && (
                                        <span className="ml-2 text-sm text-gray-400">
                                            {imageFile.name}
                                        </span>
                                    )}
                                </div>

                                {/* 수정 액션 버튼 */}
                                <div className="flex gap-2 pt-4">
                                    <button
                                        onClick={handleLpEditSubmit}
                                        disabled={isPendingLpAction}
                                        className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors text-sm disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    >
                                        <FaCheck />
                                        {isPendingLpAction ? "저장 중..." : "저장"}
                                    </button>
                                    <button
                                        onClick={handleLpEditCancel}
                                        disabled={isPendingLpAction}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm disabled:cursor-not-allowed"
                                    >
                                        <FaTimes />
                                        취소
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* 일반 모드 */
                            <>
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

                                    {/* 본인 LP인 경우에만 수정/삭제 버튼 표시 */}
                                    {isMyLp && (
                                        <>
                                            {/* 수정 버튼 */}
                                            <button
                                                onClick={handleLpEditStart}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
                                            >
                                                <FaEdit />
                                                <span>수정</span>
                                            </button>

                                            {/* 삭제 버튼 */}
                                            <button
                                                onClick={handleLpDelete}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                                            >
                                                <FaTrash />
                                                <span>삭제</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
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
                                        disabled={commentText.length === 0 || commentText.length > 200 || isCreatingComment}
                                        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                                    >
                                        {isCreatingComment ? "작성 중..." : "작성"}
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
                            {commentList.map((comment) => {
                                // 내 정보와 댓글 작성자 비교
                                const isMyComment = myInfo?.id === comment.authorId;
                                const isEditing = editingCommentId === comment.id;
                                
                                // 디버깅용
                                if (comment.id === commentList[0]?.id) {
                                    console.log('내 정보:', myInfo);
                                    console.log('첫 댓글 작성자 ID:', comment.authorId);
                                    console.log('본인 댓글 여부:', isMyComment);
                                }
                                
                                return (
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
                                                {isMyComment && <span className="text-xs text-pink-400">(내 댓글)</span>}
                                            </div>
                                            
                                            {isEditing ? (
                                                // 수정 모드
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
                                                                className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                                                            >
                                                                취소
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditSubmit(comment.id)}
                                                                disabled={!editingCommentText.trim() || editingCommentText.length > 200}
                                                                className="px-3 py-1 text-xs bg-pink-500 hover:bg-pink-600 text-white rounded transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                                                            >
                                                                수정
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                // 일반 표시 모드
                                                <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.content}</p>
                                            )}
                                        </div>
                                        
                                        {/* 본인 댓글에만 메뉴 버튼 표시 */}
                                        {isMyComment && !isEditing && (
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(openMenuId === comment.id ? null : comment.id);
                                                    }}
                                                    className="text-gray-500 hover:text-gray-300 p-1 text-xl font-bold"
                                                >
                                                    ⋮
                                                </button>
                                                {openMenuId === comment.id && (
                                                    <div 
                                                        className="absolute right-0 top-8 bg-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[100px]"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditStart(comment);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-600 flex items-center gap-2"
                                                        >
                                                            <FaEdit size={12} />
                                                            수정
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteComment(comment.id);
                                                            }}
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
