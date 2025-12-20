import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useSidebar from "../hooks/useSidebar"; // [!code ++] 새로 만든 훅 import
import { useDeleteUser } from "../hooks/mutations/useDeleteUser";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebar();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const deleteMutation = useDeleteUser();

  return (
    <>
      {/* 🔥 전체 화면 오버레이 */}
      <div
        className={`fixed inset-0 z-30  bg-opacity-100 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
      />

      {/* 🔥 사이드바 */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/90 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out shadow-2xl rounded-md
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* 상단 */}
        <div className="flex justify-between items-center h-16 p-4">
          
          <button
            onClick={closeSidebar}
            className="text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 메뉴 */}
        <nav className="flex flex-col p-4 gap-2 h-full">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg cursor-pointer  ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`
            }
            onClick={closeSidebar}
          >
            <span>찾기</span>
          </NavLink>

          <NavLink
            to="/my"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg cursor-pointer  ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`
            }
            onClick={closeSidebar}
          >
            <span>마이페이지</span>
          </NavLink>

          {/* 🔥 빈 공간 → 탈퇴 버튼을 아래로 밀기 */}
          <div className="flex-1"></div>

          {/* 🔥 탈퇴하기 버튼 */}
          <button
            className="text-white font-bold p-3 rounded-lg bg-red-500 hover:bg-red-600 cursor-pointer"
            onClick={() => setOpenDeleteModal(true)}
          >
            탈퇴하기
          </button>
        </nav>
      </aside>

      {/* 🔥 모달은 반드시 Sidebar 밖에서 렌더링해야 함 */}
      <ConfirmDeleteModal
        open={openDeleteModal}
        message="정말 탈퇴하시겠습니까?"
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          deleteMutation.mutate();
          setOpenDeleteModal(false);
        }}
      />
    </>
  );
};

export default Sidebar;
