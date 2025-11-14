import { useEffect } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export default function GoogleLoginRedirectPage() {
    const {setItem: setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {setItem: setRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    useEffect(() => {
        console.log('===== GoogleLoginRedirectPage 실행 =====');
        console.log('현재 URL:', window.location.href);
        
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
        const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

        console.log('URL에서 추출한 accessToken:', accessToken);
        console.log('URL에서 추출한 refreshToken:', refreshToken);

        if (accessToken) {
            setAccessToken(accessToken);
            console.log('accessToken 저장 완료');
        }

        if (refreshToken) {
            setRefreshToken(refreshToken);
            console.log('refreshToken 저장 완료');
            
            // 저장된 리다이렉트 경로 확인
            console.log('localStorage 확인 시작');
            const redirectPath = localStorage.getItem('redirectAfterLogin');
            console.log('Google 로그인 후 저장된 경로:', redirectPath);
            console.log('redirectPath 타입:', typeof redirectPath);
            
            if (redirectPath && redirectPath !== 'null' && redirectPath !== 'undefined') {
                localStorage.removeItem('redirectAfterLogin');
                console.log('저장된 경로로 이동:', redirectPath);
                window.location.href = redirectPath;
            } else {
                console.log('기본 경로(/my)로 이동');
                window.location.href = "/my";
            }
        } else {
            console.log('refreshToken이 없어서 리다이렉트하지 않음');
        }
    }, [setAccessToken, setRefreshToken]);

    return(
        <div>GoogleLoginRedirectPage</div>
    )
}