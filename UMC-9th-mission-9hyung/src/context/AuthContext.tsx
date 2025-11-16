import { type RequestSigninDto } from "../types/auth.ts";
import { createContext, type PropsWithChildren } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";
import { useState, useContext } from "react";
import { postSignin, postLogout } from "../apis/auth.ts";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  //const navigate = useNavigate();

  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage(),
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage(),
  );

  const login = (access: string, refresh: string) => {
    // const {data} = await postSignin(signinData)

    // const newAccessToken = data.accessToken;
    // const newRefreshToken = data.refreshToken;

    setAccessTokenInStorage(access);
    setRefreshTokenInStorage(refresh);

    setAccessToken(access);
    setRefreshToken(refresh);
    alert("로그인 성공");
    console.log("✅ AuthContext login() 실행됨 — redirect 없음");
    // window.location.href = "/my";
  };

  const logout = async () => {
    // try {
    //   await postLogout();
    //   removeAccessTokenFromStorage();
    //   removeRefreshTokenFromStorage();

    //   setAccessToken(null);
    //   setRefreshToken(null);
    //   alert("로그아웃 성공");
    // } catch (error) {
    //   console.error("로그아웃 오류", error);
    //   alert("로그아웃 실패");
    // }
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }

  return context;
};
