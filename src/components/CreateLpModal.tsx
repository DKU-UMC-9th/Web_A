import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createLp, uploadImage } from "../apis/lp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTimes } from "react-icons/fa";

interface CreateLpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateLpModal({ isOpen, onClose }: CreateLpModalProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const queryClient = useQueryClient();

    // 이미지 업로드 mutation
    const { mutate: uploadImageMutation, isPending: isUploadingImage } = useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            console.error("이미지 업로드 실패:", error);
            alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // LP 생성 mutation
    const { mutate: submitLp, isPending: isCreatingLp } = useMutation({
        mutationFn: createLp,
        onSuccess: () => {
            // LP 목록 쿼리 무효화하여 새로고침 (lps로 시작하는 모든 쿼리)
            queryClient.invalidateQueries({ queryKey: ["lps"] });
            // 모달 닫고 초기화
            handleClose();
            alert("LP가 성공적으로 생성되었습니다! 🎉");
        },
        onError: (error) => {
            console.error("LP 생성 실패:", error);
            alert("LP 생성에 실패했습니다. 다시 시도해주세요.");
        },
    });

    const isPending = isUploadingImage || isCreatingLp;

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 이미지 파일 검증
            if (!file.type.startsWith("image/")) {
                alert("이미지 파일만 업로드 가능합니다.");
                return;
            }
            
            // 파일 크기 검증 (10MB 제한)
            if (file.size > 10 * 1024 * 1024) {
                alert("이미지 크기는 10MB 이하여야 합니다.");
                return;
            }

            setImageFile(file);
            
            // 미리보기 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // 유효성 검사
        if (!title.trim()) {
            alert("LP 제목을 입력해주세요.");
            return;
        }
        
        if (!content.trim()) {
            alert("LP 내용을 입력해주세요.");
            return;
        }

        if (!imageFile) {
            alert("LP 이미지를 선택해주세요.");
            return;
        }

        // 1단계: 이미지 업로드
        uploadImageMutation(imageFile, {
            onSuccess: (imageUrl) => {
                // 2단계: 이미지 URL을 받아서 LP 생성
                submitLp({
                    title: title.trim(),
                    content: content.trim(),
                    thumbnail: imageUrl,
                    tags: tags,
                    published: true,
                });
            },
        });
    };

    const handleClose = () => {
        // 상태 초기화
        setTitle("");
        setContent("");
        setTagInput("");
        setTags([]);
        setImageFile(null);
        setImagePreview(null);
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* 헤더 */}
                <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-white">새 LP 만들기</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="모달 닫기"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* 폼 */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* LP 이미지 업로드 */}
                    <div className="flex flex-col items-center">
                        <label className="text-white text-sm font-medium mb-3">
                            LP 사진
                        </label>
                        <div className="relative flex items-center justify-center">
                            {/* 업로드된 이미지 (왼쪽, 이미지가 있을 때만 표시) */}
                            {imagePreview && (
                                <div className="relative z-20 transition-all duration-500 ease-out animate-slide-in">
                                    <div className="w-56 h-56 rounded-lg overflow-hidden bg-gray-800 shadow-2xl">
                                        <img
                                            src={imagePreview}
                                            alt="LP 미리보기"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* LP 판 이미지 (클릭 가능, 이미지가 있으면 겹침) */}
                            <div
                                onClick={handleImageClick}
                                className={`relative cursor-pointer group z-10 transition-all duration-500 ${
                                    imagePreview ? "-ml-16" : ""
                                }`}
                            >
                                <div className="w-64 h-64 rounded-full overflow-hidden bg-gray-800 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                                    <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black relative flex items-center justify-center">
                                        {/* LP 판 원형 그루브 */}
                                        <div className="absolute inset-0">
                                            {[...Array(8)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute inset-0 rounded-full border border-gray-700/30"
                                                    style={{
                                                        margin: `${i * 12}px`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        {/* 중앙 레이블 */}
                                        <div className="w-20 h-20 bg-white rounded-full shadow-inner flex items-center justify-center z-10">
                                            <div className="w-4 h-4 bg-gray-900 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                {/* 호버 오버레이 */}
                                <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <p className="text-white text-center px-4 text-sm font-medium">
                                        {imagePreview ? "이미지 변경" : "클릭하여 이미지 선택"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <p className="text-gray-400 text-xs mt-4">
                            {imagePreview 
                                ? "LP 판을 클릭하여 이미지를 변경할 수 있습니다" 
                                : "LP 판을 클릭하여 사진을 업로드하세요 (최대 10MB)"}
                        </p>
                    </div>
                    
                    <style>{`
                        @keyframes slide-in {
                            from {
                                opacity: 0;
                                transform: translateX(-20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateX(0);
                            }
                        }
                        .animate-slide-in {
                            animation: slide-in 0.5s ease-out;
                        }
                    `}</style>

                    {/* LP 제목 */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            LP Name
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="LP 제목을 입력하세요"
                            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                            maxLength={100}
                        />
                    </div>

                    {/* LP 내용 */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            LP Content
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="LP 내용을 입력하세요"
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
                            maxLength={1000}
                        />
                    </div>

                    {/* LP 태그 */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            LP Tag
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                placeholder="태그를 입력하세요"
                                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                                maxLength={20}
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        {/* 태그 목록 */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-pink-100 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                    >
                        {isPending ? "생성 중..." : "Add LP"}
                    </button>
                </form>
            </div>
        </div>
    );
}
