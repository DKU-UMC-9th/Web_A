import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { RequestSigninDTO} from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";
import { ca } from "zod/v4/locales";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signInData: RequestSigninDTO) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider=({children}: PropsWithChildren)=>{
    const {getItem:getAccessTokenFromStorage,
        setItem:setAccessTokenInStorage,
        removeItem:removeAccessTokenFromStorage} 
        = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {getItem:getRefreshTokenFromStorage,
        setItem:setRefreshTokenInStorage,
        removeItem:removeRefreshTokenFromStorage} 
        = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(
        getAccessTokenFromStorage(),
    );
    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage(),
    );


    const login = async(signinData:RequestSigninDTO)=> {
       try{
         const{data}= await postSignin(signinData);

        if (data) {
            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken;

            setAccessTokenInStorage(newAccessToken);
            setRefreshTokenInStorage(newRefreshToken);

            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);

            alert("로그인에 성공했습니다.");
            
        }
       }catch(error){
        console.error("로그인 오류",error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
       }
    };

    const logout = async()=> {
        try{
            await postLo