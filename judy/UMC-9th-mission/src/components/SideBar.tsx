import { Search, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface SideBarProps {
    className?: string;
}

export default function SideBar({ className }: SideBarProps) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* 버거 버튼 */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 text-white cursor-pointer"
                aria-label="메뉴 토글"
            >
                <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
                </svg>
            </button>

            {/* 오버레이 - 사이드바 열릴 때 배경 */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-screen w-3/4 sm:w-64 lg:w-64 bg-black text-white flex flex-col transition-all duration-300 z-40
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${className || ''}`}
            >
                {/* 상단 로고 + 메뉴버튼 */}
                <div className="flex items-center justify-center px-4 h-20 ml-5">
                    <span className="text-pink-500 text-xl font-bold tracking-wide cursor-pointer"
                            onClick={() => {
                                navigate("/");
                                setIsOpen(true);
                            }}
                    >
                        돌려돌려 LP판
                    </span>
                </div>

                {/* 메뉴 리스트 */}
                <nav className="flex flex-col mt-4 gap-4 px-4 text-sm font-medium">
                    <Link
                        to="/search"
                        className="flex items-center gap-3 hover:text-pink-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <Search className="w-5 h-5" />
                        <span>찾기</span>
                    </Link>

                    <Link
                        to="/mypage"
                        className="flex items-center gap-3 hover:text-pink-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <User className="w-5 h-5" />
                        <span>마이페이지</span>
                    </Link>
                </nav>

                {/* 하단 탈퇴하기 */}
                <div className="mt-auto px-4 pb-12">
                    <button className="text-xs text-gray-400 hover:text-red-400 transition-colors absolute ml-10">
                        탈퇴하기
                    </button>
                </div>
            </aside>
        </>
    );
}
