import { useEffect } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export default function GoogleLoginRedirectPage() {
    const {setItem: setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {setItem: setRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
        const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

        if (accessToken) {
            setAccessToken(accessToken);
        }

        if (refreshToken) {
            setRefreshToken(refreshToken);
            
            // 저장된 리다이렉트 경로 확인
            const redirectPath = sessionStorage.getItem('redirectAfterLogin') || localStorage.getItem('redirectAfterLogin');
            
            if (redirectPath && redirectPath !== 'null' && redirectPath !== 'undefined') {
                sessionStorage.removeItem('redirectAfterLogin');
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectPath;
            } else {
                window.location.href = "/my";
            }
        }
    }, [setAccessToken, setRefreshToken]);

    return(
        <div>GoogleLoginRedirectPage</div>
    )
}