import { Outlet, useNavigate } from "react-router-dom";

export default function HomeLayout() {
    const navigate = useNavigate();

    return(
        <div className="h-dvh flex flex-col">
            <nav className="w-full flex justify-between items-center px-8 py-4 bg-[#1f1f1f] text-white">
                {/* 왼쪽 */}
                <h1
                    className="text-pink-500 font-bold text-[24px] cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    돌려돌려LP판
                </h1>

                {/* 오른쪽 */}
                <div className="flex items-center gap-3">
                    <button
                        className="px-4 py-2 text-sm text-white rounded-md bg-black cursor-pointer"
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
                </div>
            </nav>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="bg-[#000000] p-4"></footer>
        </div>
    )
}
