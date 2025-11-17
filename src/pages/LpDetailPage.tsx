import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { FaArrowLeft } from "react-icons/fa";
import { useLpMutations } from "../hooks/useLpMutations";
import LpInfo from "../components/LpInfo";
import LpEditForm from "../components/LpEditForm";
import CommentSection from "../components/CommentSection";

const LpDetailPage = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    
    // LP 수정 관련 상태
    const [isEditingLp, setIsEditingLp] = useState(false);
    const [editLpTitle, setEditLpTitle] = useState("");
    const [editLpContent, setEditLpContent] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const { data: lp, isPending, isError } = useGetLpDetail(lpid || "");
    const { data: myInfo } = useGetMyInfo();
    
    // 본인 LP 판별
    const isMyLp = myInfo?.id === lp?.authorId;
    
    // 좋아요 여부
    const isLiked = lp?.likes.some(like => like.userId === myInfo?.id) || false;
    
    // LP mutations
    const {
        uploadImageMutation,
        updateLpMutation,
        deleteLpMutation,
        addLikeMutation,
        removeLikeMutation,
    } = useLpMutations(lpid || "");

    const isPendingLpAction = uploadImageMutation.isPending || updateLpMutation.isPending;

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
            uploadImageMutation.mutate(imageFile, {
                onSuccess: (imageUrl) => {
                    updateLpMutation.mutate({
                        lpId: lpid || "",
                        lpData: {
                            ...updateData,
                            thumbnail: imageUrl,
                        },
                    }, {
                        onSuccess: () => {
                            setIsEditingLp(false);
                            setImageFile(null);
                            setImagePreview(null);
                        }
                    });
                },
            });
        } else {
            // 이미지 변경 없음
            updateLpMutation.mutate({
                lpId: lpid || "",
                lpData: updateData,
            }, {
                onSuccess: () => {
                    setIsEditingLp(false);
                    setImageFile(null);
                    setImagePreview(null);
                }
            });
        }
    };

    // LP 삭제
    const handleLpDelete = () => {
        if (window.confirm("정말 이 LP를 삭제하시겠습니까? 삭제된 LP는 복구할 수 없습니다.")) {
            deleteLpMutation.mutate(lpid || "");
        }
    };

    // 좋아요 토글 핸들러
    const handleLikeToggle = () => {
        if (isLiked) {
            removeLikeMutation.mutate();
        } else {
            addLikeMutation.mutate();
        }
    };

    // 로딩 스켈레톤
    if (isPending) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="w-24 h-10 bg-gray-800 rounded-lg mb-6 animate-pulse"></div>
                    <div className="aspect-square max-w-md mx-auto bg-gray-800 rounded-lg mb-8 animate-pulse"></div>
                    <div className="h-10 bg-gray-800 rounded w-2/3 mb-4 animate-pulse"></div>
                    <div className="flex gap-4 mb-6">
                        <div className="h-6 bg-gray-800 rounded w-32 animate-pulse"></div>
                        <div className="h-6 bg-gray-800 rounded w-24 animate-pulse"></div>
                    </div>
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
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        뒤로가기
                    </button>
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
                            <LpEditForm
                                title={editLpTitle}
                                content={editLpContent}
                                imageFile={imageFile}
                                fileInputRef={fileInputRef}
                                onTitleChange={(e) => setEditLpTitle(e.target.value)}
                                onContentChange={(e) => setEditLpContent(e.target.value)}
                                onImageChange={handleImageChange}
                                onSubmit={handleLpEditSubmit}
                                onCancel={handleLpEditCancel}
                                isPending={isPendingLpAction}
                            />
                        ) : (
                            <LpInfo
                                lp={lp}
                                isLiked={isLiked}
                                isMyLp={isMyLp}
                                onLikeToggle={handleLikeToggle}
                                onEditStart={handleLpEditStart}
                                onDelete={handleLpDelete}
                            />
                        )}
                    </div>
                </div>

                {/* 댓글 섹션 */}
                <CommentSection lpid={lpid || ""} myInfo={myInfo} />
            </div>
        </div>
    );
};

export default LpDetailPage;
