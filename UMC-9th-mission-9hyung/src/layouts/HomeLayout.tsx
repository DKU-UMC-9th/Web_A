import React from "react";
import { Outlet, Link } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-[#f8f9fa]">
      {/* 네비게이션 바 */}
      <nav className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 / 타이틀 */}
            <Link
              to="/"
              className="text-2xl font-semibold text-blue-600"
            >
              9현지의 페이지
            </Link>
            {/* 로그인 / 회원가입 버튼 */}
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-gray-600 font-semibold hover:text-blue-600  px-3 py-2 rounded-md"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex">
        <Outlet />
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 9hyung's Page. All Rights Reserved.</p>
          <p className="text-gray-400 mt-2">Created for UMC 9th Web Mission</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
