import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getMyInfo, postLogout } from "../apis/auth";
import { Search, Plus } from 'lucide-react';
import type { ResponseMyInfoDTO } from "../types/auth";
import CreateLpModal from "./CreateLpModal";
import { createLp } from "../apis/lps";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export default function Header() {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [userInfo, setUserInfo] = useState<ResponseMyInfoDTO | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    useEffect(() => {
        if (accessToken) {
            const fetchUserInfo = async () => {
                try {
                    const response = await getMyInfo();
                    setUserInfo(response);
                } catch (error) {
                    console.error("사용자 정보 가져오기 실패:", error);
                }
            };
            fetchUserInfo();
        } else {
            setUserInfo(null);
        }
    }, [accessToken]);

    // LP 생성 mutation
    const createLpMutation = useMutation({
        mutationFn: createLp,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lps'] });
            setIsModalOpen(false);
        },
        onError: (error) => {
            console.error('Failed to create LP:', error);
            alert('LP 생성에 실패했습니다. 다시 시도해주세요.');
        }
    });

    const handleCreateLp = (data: { title: string; content: string; tags: string[]; thumbnail?: string }) => {
        createLpMutation.mutate(data);
    };

    // 로그아웃 mutation
    const logoutMutation = useMutation({
        mutationFn: postLogout,
        onSuccess: () => {
            removeAccessToken();
            removeRefreshToken();
            setUserInfo(null);
            alert("로그아웃 성공");
            navigate("/");
        },
        onError: (error) => {
            console.error('로그아웃 실패:', error);
            alert('로그아웃에 실패했습니다.');
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <>
            <nav className="w-full flex justify-between items-center px-8 py-4 bg-[#000000] text-white">
                {/* 왼쪽 - 빈 공간 또는 로고 */}
                <div></div>

                {/* 오른쪽 - 로그인 상태에 따른 버튼 */}
                <div className="flex flex-row items-center gap-3">
                    {accessToken && userInfo?.data ? (
                        <>
                            <div className="text-sm text-white flex flex-row gap-3">
                                <Search className="w-5 h-5" />
                                {userInfo.data.name}님 반갑습니다.
                            </div>
                            <button
                                className="px-4 py-2 text-sm text-white rounded-md bg-[#1f1f1f] cursor-pointer"
                                onClick={handleLogout}
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="px-4 py-2 text-sm text-white rounded-md bg-[#1f1f1f] cursor-pointer"
                                onClick={() => navigate("/login")}
                            >
                                로그인
                            </button>
                            <button
                                className="px-4 py-2 text-sm text-white bg-pink-500 rounded-md hover:bg-pink-600 cursor-pointer"
                                onClick={() => navigate("/signup")}
                            >
                                회원가입
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* 플로팅 버튼 */}
            <button
                className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer z-50 transition-all hover:scale-110"
                onClick={() => setIsModalOpen(true)}
                aria-label="Create new LP"
            >
                <Plus className="w-6 h-6 text-white" />
            </button>

            {/* Create LP Modal */}
            <CreateLpModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateLp}
            />
        </>
    );
}
