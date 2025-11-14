import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();

    const menuItems = [
        { path: "/search", label: "찾기", icon: <FaSearch size={20} /> },
        { path: "/my", label: "마이페이지", icon: <FaUser size={20} /> },
    ];

    return (
        <>
            {/* 오버레이 - 사이드바 외부 클릭 시 닫기 */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={onClose}
                />
            )}

            {/* 사이드바 */}
            <aside
                className={`fixed left-0 top-[64px] h-[calc(100vh-64px)] w-64 bg-black text-white border-r border-gray-800 z-40 transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        location.pathname === item.path
                                            ? "bg-pink-500 text-white"
                                            : "hover:bg-gray-800"
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* 탐색하기 버튼 (하단) */}
                <div className="absolute bottom-8 left-4 right-4">
                    <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        탐색하기
                    </button>
                </div>
            </aside>
        </>
    );
}
