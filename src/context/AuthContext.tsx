/* eslint-disable react-refresh/only-export-components */
import { createContext, type Context, type PropsWithChildren, useState, useContext } from "react";
import type { RequestSigninDTO } from "../types/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { postSignin, postLogout } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signInData:RequestSigninDTO) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext : Context<AuthContextType> = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login:async () => {},
    logout:async () => {},
});

export const AuthProvider = ({children}:PropsWithChildren) => {
    const {getItem: getAccessTokenFromStorage,setItem: setAccessTokenInStorage, removeItem: removeAccessTokenFromStorage} = useLocalStorage(
        LOCAL_STORAGE_KEY.accessToken
    );

    const {getItem: getRefreshTokenFromStorage, setItem: setRefreshTokenInStorage, removeItem: removeRefreshTokenFromStorage} = useLocalStorage(
        LOCAL_STORAGE_KEY.refreshToken
    );

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());

    const login = async (signInData: RequestSigninDTO) => {
        try {
            const response = await postSignin(signInData);

            if(response && response.data) {
                const newAccessToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);
                alert("로그인 성공");
                window.location.replace("/my");
            } else {
                throw new Error("로그인 응답 데이터가 없습니다.");
            }
        } catch (error) {
            console.error("로그인 실패:", error);
            alert("로그인 실패");    
        }
    };
    const logout = async() => {
        try {
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();

            setAccessToken(null);
            setRefreshToken(null);
            alert("로그아웃 성공");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context : AuthContextType = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }

    return context;
}