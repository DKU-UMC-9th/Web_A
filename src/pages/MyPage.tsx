import { useEffect, useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyInfo, type UpdateUserDto } from "../apis/user";
import { uploadImage } from "../apis/lp";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { FaTimes, FaCog } from "react-icons/fa";

export default function MyPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { data: myInfo, isPending } = useGetMyInfo();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        // 구글 로그인 후 리다이렉트 처리
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || localStorage.getItem('redirectAfterLogin');
        
        if (redirectPath && redirectPath !== 'null' && redirectPath !== 'undefined' && redirectPath !== '/my') {
            sessionStorage.removeItem('redirectAfterLogin');
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectPath, { replace: true });
            return;
        }
    }, [navigate]);

    // 모달 열 때 현재 정보로 초기화
    useEffect(() => {
        if (isModalOpen && myInfo) {
            setName(myInfo.name || "");
            setBio(myInfo.bio || "");
            setImagePreview(myInfo.avatar || null);
        }
    }, [isModalOpen, myInfo]);

    // 이미지 업로드 mutation
    const { mutate: uploadImageMutation, isPending: isUploadingImage } = useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            console.error("이미지 업로드 실패:", error);
            alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // 프로필 수정 mutation
    const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
        mutationFn: updateMyInfo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
            setIsModalOpen(false);
            setImageFile(null);
            alert("프로필이 성공적으로 수정되었습니다! ✨");
        },
        onError: (error) => {
            console.error("프로필 수정 실패:", error);
            alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
        },
    });

    const isPendingAction = isUploadingImage || isUpdatingProfile;

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

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

    const handleSubmit = () => {
        // 이름 유효성 검사
        if (!name.trim()) {
            alert("이름을 입력해주세요.");
            return;
        }

        const updateData: UpdateUserDto = {
            name: name.trim(),
            bio: bio.trim() || undefined,
        };

        // 이미지 파일이 있으면 먼저 업로드
        if (imageFile) {
            uploadImageMutation(imageFile, {
                onSuccess: (imageUrl) => {
                    updateProfile({
                        ...updateData,
                        avatar: imageUrl,
                    });
                },
            });
        } else if (imagePreview && imagePreview !== myInfo?.avatar) {
            // 이미지 URL이 변경된 경우 (기존 URL 사용)
            updateProfile({
                ...updateData,
                avatar: imagePreview,
            });
        } else {
            // 이미지 변경 없음
            updateProfile(updateData);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setImageFile(null);
        setImagePreview(null);
    };

    if (isPending) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-gray-900 rounded-2xl p-8 shadow-2xl">
                {/* 프로필 이미지 */}
                <div className="flex flex-col items-center mb-6">
                    {myInfo?.avatar ? (
                        <img
                            src={myInfo.avatar}
                            alt={myInfo.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow-lg"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-bold border-4 border-pink-500">
                            {myInfo?.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* 사용자 정보 */}
                <div className="space-y-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                        <label className="text-gray-400 text-sm">이름</label>
                        <div className="text-xl font-bold">{myInfo?.name}</div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                        <label className="text-gray-400 text-sm">이메일</label>
                        <div className="text-lg">{myInfo?.email}</div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <label className="text-gray-400 text-sm">자기소개</label>
                        <div className="text-lg whitespace-pre-wrap">
                            {myInfo?.bio || "자기소개가 없습니다."}
                        </div>
                    </div>
                </div>

                {/* 버튼들 */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors font-semibold"
                    >
                        <FaCog />
                        프로필 수정
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                        로그아웃
                    </button>
                </div>
            </div>

            {/* 프로필 수정 모달 */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleCloseModal();
                        }
                    }}
                >
                    <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {/* 헤더 */}
                        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-bold text-white">프로필 수정</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* 폼 */}
                        <div className="p-6 space-y-6">
                            {/* 프로필 이미지 */}
                            <div className="flex flex-col items-center">
                                <label className="text-white text-sm font-medium mb-3">
                                    프로필 사진
                                </label>
                                <div
                                    onClick={handleImageClick}
                                    className="relative cursor-pointer group"
                                >
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="프로필 미리보기"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-pink-500"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-bold border-4 border-gray-600">
                                            {name.charAt(0).toUpperCase() || "?"}
                                        </div>
                                    )}
                                    {/* 호버 오버레이 */}
                                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <p className="text-white text-center px-4 text-sm font-medium">
                                            {imagePreview ? "사진 변경" : "사진 선택"}
                                        </p>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <p className="text-gray-400 text-xs mt-2">
                                    클릭하여 프로필 사진 업로드 (선택사항, 최대 10MB)
                                </p>
                            </div>

                            {/* 이름 */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    이름 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="이름을 입력하세요"
                                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                                    maxLength={50}
                                />
                            </div>

                            {/* 자기소개 */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    자기소개 (선택사항)
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="자기소개를 입력하세요"
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
                                    maxLength={200}
                                />
                                <div className="text-right text-xs text-gray-400 mt-1">
                                    {bio.length} / 200
                                </div>
                            </div>

                            {/* 저장 버튼 */}
                            <button
                                onClick={handleSubmit}
                                disabled={isPendingAction || !name.trim()}
                                className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                            >
                                {isPendingAction ? "저장 중..." : "저장"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}