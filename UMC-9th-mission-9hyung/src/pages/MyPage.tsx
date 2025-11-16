import React from "react";
import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { type ResponseMyInfoDto } from "../types/auth.ts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal.tsx";
import { useQuery } from "@tanstack/react-query";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  //const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    staleTime: 0,
  });

  //   useEffect(() => {
  //     const getData = async () => {
  //       // 👇 try...catch를 추가합니다.
  //       try {
  //         const response = await getMyInfo();
  //         console.log("✅ [MyPage] 데이터 수신 성공:", response); // 👈 성공 로그
  //         setData(response);
  //       } catch (error) {
  //         // 👇 실패했을 때 에러를 콘솔에 찍습니다.
  //         console.error("❌ [MyPage] 데이터 수신 실패:", error);
  //       }
  //     };
  //     getData();
  //   }, []);
  if (isLoading || !data) {
    return <div className="text-white p-6">로딩 중...</div>;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!data) {
    return <div className="text-white p-6">로딩 중...</div>;
  }

  const user = data.data;

  return (
    <div className="flex justify-center py-16 px-4 ">
      {/* 카드 */}
      <div
        className="w-full max-w-xl bg-[#ffffff] rounded-2xl shadow-xl p-10 
     flex items-center justify-center gap-10"
      >
        {/* 왼쪽 — 프로필 이미지 */}
        <div className="flex-shrink-0">
          <img
            src={user.avatar ?? "/default_profile.png"}
            alt="프로필 이미지"
            className="w-50 h-50 rounded-full object-cover bg-gray-700 shadow-lg"
          />
        </div>

        {/* 오른쪽 — 텍스트 정보 */}
        <div className="flex flex-col flex-1 gap-4">
          {/* 이름 + 설정 아이콘 */}
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold text-black">{user.name}</h2>

            <button
              onClick={() => setOpenModal(true)}
              className="text-2xl hover:scale-110 transition cursor-pointer"
            >
              ⚙️
            </button>
          </div>

          {/* Bio */}
          <p className="text-gray-800 text-lg font-extrabold">
            {user.bio || "소개글이 없습니다."}
          </p>

          {/* Email */}
          <p className="text-gray-400 text-md">{user.email}</p>

          {/* Logout 버튼 */}
          <button
            className="mt-4 w-28 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition cursor-pointer"
            onClick={async () => {
              await logout();
              navigate("/");
            }}
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      {openModal && (
        <EditProfileModal
          user={user}
          onClose={() => {
            setOpenModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default MyPage;
