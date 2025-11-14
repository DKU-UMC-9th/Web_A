import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { type ResponseMyInfoDTO } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
    const navigate = useNavigate();
    const {logout} = useAuth();
    const [data, setData] = useState<ResponseMyInfoDTO | null>(null);

   useEffect(() => {
    // 구글 로그인 후 리다이렉트 처리 - sessionStorage 우선 확인
    const redirectPath = sessionStorage.getItem('redirectAfterLogin') || localStorage.getItem('redirectAfterLogin');
    console.log('MyPage - redirectAfterLogin 확인:', redirectPath);
    console.log('sessionStorage:', sessionStorage.getItem('redirectAfterLogin'));
    console.log('localStorage:', localStorage.getItem('redirectAfterLogin'));
    
    if (redirectPath && redirectPath !== 'null' && redirectPath !== 'undefined' && redirectPath !== '/my') {
        sessionStorage.removeItem('redirectAfterLogin');
        localStorage.removeItem('redirectAfterLogin');
        console.log('저장된 경로로 이동:', redirectPath);
        navigate(redirectPath, { replace: true });
        return;
    }

    const getData = async () => {
        const response = await getMyInfo();
        setData(response);
    };

    getData();
}, [navigate]);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    }

    return(
        <div className="flex flex-col items-center justify-center gap-4 text-black">
            {data?.data && (
                <div className="text-lg">
                    {data.data.name}님, 환영합니다!
                </div>
            )}
            {data?.data && (
                <div className="text-lg">
                    {data.data.email}
                </div>
            )}
            {data?.data && (
                <img src={data.data.avatar as string} alt={"프로필 이미지"}/>
            )}
            <button
                onClick={handleLogout}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
            >
                로그아웃
            </button>
        </div>
    )
}