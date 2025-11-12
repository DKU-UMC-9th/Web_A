import React, { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const GoogleLoginRedirectPage = () => {
  const { setItem: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken,
  );
  const { setItem: setRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken,
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
    const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);
    // ✅ 1차: 서버가 전달했을 수도 있는 redirect
    let redirectPath = urlParams.get("redirect");

    // ✅ 2차: 서버가 무시한 경우 localStorage에서 복구
    if (!redirectPath) {
      redirectPath = localStorage.getItem("google_login_redirect_path") || "/";
    }

    if (accessToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      window.location.href = redirectPath;
      // ✅ 한 번 쓰면 로컬스토리지 데이터 정리
      localStorage.removeItem("google_login_redirect_path");
    }

    console.log("🔍 현재 URL:", window.location.href);
    console.log("🔍 accessToken param:", urlParams.get("accessToken"));
    console.log("🔍 refreshToken param:", urlParams.get("refreshToken"));
    console.log("🔍 redirect param:", urlParams.get("redirect"));
  }, [setAccessToken, setRefreshToken]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600 text-lg">로그인 처리 중입니다...</p>
    </div>
  );
};

export default GoogleLoginRedirectPage;
