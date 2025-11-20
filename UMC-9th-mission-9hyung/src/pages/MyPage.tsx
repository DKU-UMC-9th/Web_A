import React from "react";
import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { type ResponseMyInfoDto } from "../types/auth.ts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto>([]);

    useEffect(() => {
            const getData = async () => {
                // 👇 try...catch를 추가합니다.
                try {
                    const response = await getMyInfo();
                    console.log("✅ [MyPage] 데이터 수신 성공:", response); // 👈 성공 로그
                    setData(response);
                } catch (error) {
                    // 👇 실패했을 때 에러를 콘솔에 찍습니다.
                    console.error("❌ [MyPage] 데이터 수신 실패:", error); 
                }
            }
            getData();
        }, [])

    const handleLogout = async () => {
        await logout();
        navigate("/");
    }


  return (
  <div>
    <h1>{data.data?.name}님 환영합니다.</h1>
    <img src ={data.data?.avatar as string} alt={"구글 프로필 사진"} />
    <h1>{data.data?.email}</h1>

    <button 
    className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90"
    onClick={handleLogout}>로그아웃</button>
  </div>
  )
};

export default MyPage;
