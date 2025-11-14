import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { Search, Plus } from 'lucide-react';
import type { ResponseMyInfoDTO } from "../types/auth";

export default function Header() {
    const navigate = useNavigate();
    const { accessToken, logout } = useAuth();
    const [userInfo, setUserInfo] = useState<ResponseMyInfoDTO | null>(null);

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
                                onClick={async () => {
                                    await logout();
                                    navigate("/");
                                }}
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
                className="fixed bottom-20 right-30 w-14 h-14 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer z-50 transition-colors"
                onClick={() => {
                    // 원하는 동작을 여기에 추가하세요
                    console.log('플로팅 버튼 클릭');
                }}
            >
                <Plus className="w-6 h-6 text-white" />
            </button>
        </>
    );
}
