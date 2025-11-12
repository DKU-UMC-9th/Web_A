import { type RequestSigninDto } from "../types/auth.ts" 
import { createContext, type PropsWithChildren } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";
import { useState, useContext } from "react";
import { postSignin, postLogout } from "../apis/auth.ts";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signinData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({children}: PropsWithChildren) => {
    //const navigate = useNavigate();

    const {
        getItem: getAccessTokenFromStorage, 
        setItem: setAccessTokenInStorage, 
        removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(
        LOCAL_STORAGE_KEY.accessToken
    );
    const {
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokenInStorage,
        removeItem: removeRefreshTokenFromStorage
    } = useLocalStorage(
        LOCAL_STORAGE_KEY.refreshToken
    )

    const [accessToken, setAccessToken] = useState<string | null>(
        getAccessTokenFromStorage(),
    )

    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage(),
    )

    const login = async (signinData: RequestSigninDto) => {
        try {
            const {data} = await postSignin(signinData)

            if( data) {
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                // // 👇 [수정] 토큰에 포함된 앞뒤 따옴표(큰따옴표, 둥근따옴표)를 모두 제거합니다.
                // if (newAccessToken) {
                //     newAccessToken = newAccessToken.replace(/^["“]|["”]$/g, '');
                // }
                // if (newRefreshToken) {
                //     newRefreshToken = newRefreshToken.replace(/^["“]|["”]$/g, '');
                // }

                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                alert("로그인 성공");
                console.log("✅ AuthContext login() 실행됨 — redirect 없음");
                // window.location.href = "/my";
            }
        } catch (error) {
            console.error("로그인 오류", error);
            alert("로그인 실패")
        }
    }

    const logout = async () => {
        try {
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();

            setAccessToken(null);
            setRefreshToken(null);
            alert("로그아웃 성공");
        } catch (error){
            console.error("로그아웃 오류", error);
            alert("로그아웃 실패");
        }
    }

    return (
        <AuthContext.Provider value={{accessToken, refreshToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }

    return context;
}