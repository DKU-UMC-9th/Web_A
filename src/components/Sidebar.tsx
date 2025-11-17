import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaSearch, FaUser, FaTimes } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../apis/auth";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const menuItems = [
        { path: "/search", label: "찾기", icon: <FaSearch size={20} /> },
        { path: "/my", label: "마이페이지", icon: <FaUser size={20} /> },
    ];

    // 회원 탈퇴 mutation
    const { mutate: deleteAccountMutation, isPending: isDeletingAccount } = useMutation({
        mutationFn: deleteAccount,
        onSuccess: async () => {
            await logout();
            setShowDeleteModal(false);
            alert("회원 탈퇴가 완료되었습니다.");
            navigate("/login");
        },
        onError: (error) => {
            console.error("회원 탈퇴 실패:", error);
            alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
        },
    });

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        deleteAccountMutation();
    };

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

                {/* 하단 버튼들 */}
                <div className="absolute bottom-8 left-4 right-4 space-y-3">
                    
                    <button 
                        onClick={handleDeleteAccount}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        탈퇴하기
                    </button>
                </div>
            </aside>

            {/* 회원 탈퇴 확인 모달 */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">정말 탈퇴하시겠습니까?</h2>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <p className="text-gray-300 mb-6">
                            탈퇴 시 모든 게시글, 댓글, 좋아요, 사용자 정보가 삭제되며 복구할 수 없습니다.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeletingAccount}
                                className="flex-1 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {isDeletingAccount ? "처리 중..." : "예"}
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                            >
                                아니오
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
