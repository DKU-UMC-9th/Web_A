import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebar();

  const NavLinks = () => (
    <nav className="flex flex-col p-4 gap-2">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg ${
            isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'
          }`
        }
        onClick={closeSidebar} 
      >
        <span>찾기</span>
      </NavLink>
      <NavLink
        to="/my"
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg ${
            isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'
          }`
        }
        onClick={closeSidebar}
      >
        <span>마이페이지</span>
      </NavLink>
      <div className="flex-1" />
      <button 
        className="text-gray-400 p-3 flex items-center gap-3 hover:bg-gray-800 rounded-lg text-left"
        onClick={closeSidebar}
      >
        <span>탈퇴하기</span>
      </button>
    </nav>
  );

  return (
    <>
      {/* 1. 외부 영역 (오버레이)
        - isOpen 상태에 따라 투명도(opacity)와 가시성(visible/invisible)을 조절합니다.
        - 요청하신 대로 메인 콘텐츠가 보이도록 'bg-black', 'bg-opacity-50'를 제거하고 투명하게 만듭니다.
      */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={closeSidebar}
      />
      
      {/* 2. 사이드바 본체
        - isOpen 상태에 따라 'transform' 속성을 조절하여 슬라이드 애니메이션을 적용합니다.
        - 'translate-x-0' (열림) vs '-translate-x-full' (닫힘)
      */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex justify-between items-center h-16 p-4">
          <span className="font-bold text-2xl text-white">DOLIGO</span>
          <button onClick={closeSidebar} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <NavLinks />
      </aside>
    </>
  );
};

export default Sidebar;