import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    return(
        <div className="w-full flex flex-col items-center justify-center text-center gap-15">
            <h1 className="text-6xl font-extrabold text-blue-600 drop-shadow-lg">
                Jiwoo Home
            </h1>
            <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white font-bold text-lg px-12 py-2.5 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition-transform hover:scale-105"
            >
                로그인
            </button>
            <button
                onClick={() => navigate("/sign")}
                className="bg-white text-blue-600 font-bold text-lg px-12 py-2.5 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition-transform hover:scale-105"
            >
                회원가입
            </button>
        </div>
    );
};
export default HomePage;