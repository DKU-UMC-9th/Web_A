import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import { useQuery } from "@tanstack/react-query";
import { type ResponseMyInfoDto } from "../types/auth";
import { QUERY_KEY } from "../constants/key";
import { getMyInfo } from "../apis/auth";
import { useLogout } from "../hooks/mutations/useLogout";

const Navbar = () => {
  const { accessToken, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { mutate: logoutMutate } = useLogout();

  const { data: userData } = useQuery<ResponseMyInfoDto>({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

  const handleLogout = async () => {
    logoutMutate();
  };

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 cursor-pointer " // 태블릿 이상에선 숨김
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M7.95 11.95h32m-32 12h32m-32 12h32"
                />
              </svg>
            </button>

            <Link
              to="/"
              className="text-2xl font-semibold text-blue-600"
            >
              9현지의 LP
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to={"/"}
              className="text-gray-600 font-semibold hover:text-blue-600  px-3 py-2 rounded-md"
            >
              검색
            </Link>
            {/* 👇 9. 인증 상태에 따라 조건부 렌더링 */}
            {!accessToken ? (
              // 비로그인 상태
              <>
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
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
              </>
            ) : (
              // 로그인 상태
              <>
                {/* 10. 환영 문구 (첨부한 이미지와 유사하게) */}
                <span className="font-semibold px-3 py-2 text-gray-600">
                  {userData ? (
                    <>
                      <span className="text-pink-500 font-bold">
                        {userData.data?.name}
                      </span>
                      님 반갑습니다.
                    </>
                  ) : (
                    "..."
                  )}
                </span>

                <Link
                  to={"/my"}
                  className="text-gray-600 font-semibold hover:text-blue-600  px-3 py-2 rounded-md"
                >
                  마이 페이지
                </Link>
                {/* 11. 로그아웃 버튼 */}
                <button
                  onClick={handleLogout}
                  className="text-gray-600 font-semibold hover:text-blue-600  px-3 py-2 rounded-md cursor-pointer"
                >
                  로그아웃
                </button>
              </>
            )}

            {/* 검색 링크는 항상 보이도록 유지 */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
