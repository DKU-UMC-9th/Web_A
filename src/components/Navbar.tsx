import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useQueryClient } from "@tanstack/react-query";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface NavbarProps {
    onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const { data: userInfo } = useGetMyInfo();
    const queryClient = useQueryClient();

    const userName = userInfo?.name || "사용자";

    const handleLogout = () => {
        // localStorage에서 토큰 제거
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        
        // React Query 캐시 초기화
        queryClient.clear();
        
        // 로그인 페이지로 이동
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 bg-[#1f1f1f] text-white">
            {/* 왼쪽: 햄버거 메뉴 + 로고 */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="text-white hover:text-pink-500 transition-colors p-2"
                    aria-label="메뉴 토글"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect y="8" width="48" height="4" fill="currentColor" />
                        <rect y="22" width="48" height="4" fill="currentColor" />
                        <rect y="36" width="48" height="4" fill="currentColor" />
                    </svg>
                </button>
                <h1
                    className="text-pink-500 font-bold text-[24px] cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    DOLIGO
                </h1>
            </div>

            {/* 오른쪽 */}
            <div className="flex items-center gap-4">
                {accessToken ? (
                    <>
                        <span className="text-white">
                            {userName}님 반갑습니다.
                        </span>
                        <button
                            className="px-4 py-2 text-sm text-white bg-pink-500 rounded-md hover:bg-pink-600 cursor-pointer"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="px-4 py-2 text-sm text-white rounded-md hover:bg-gray-800 cursor-pointer"
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
    );
}

