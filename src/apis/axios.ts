import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean; // 요청 재시도 여부를 나타내는 플래그
}

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지한다.
let refreshPromise: Promise<string | null> | null = null;

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
})

// 대기 중인 요청을 저장하는 배열
let refreshSubscribers: Array<(token: string | null) => void> = [];

// Refresh Token이 갱신되면 대기 중인 요청들을 재실행
const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

// Refresh 실패 시 대기 중인 요청들을 모두 거부
const onRefreshFailed = () => {
    refreshSubscribers.forEach((callback) => callback(null));
    refreshSubscribers = [];
};

// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가한다.
axiosInstance.interceptors.request.use(
    (config) => {
        const tokenString = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
        if (tokenString) {
            try {
                const token = JSON.parse(tokenString);
                config.headers.Authorization = `Bearer ${token}`;
            } catch {
                config.headers.Authorization = `Bearer ${tokenString}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 401 에러 발생 -> refreshToken으로 토큰 갱신 시도
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // config가 없는 경우 에러 반환
        if (!originalRequest) {
            return Promise.reject(error);
        }

        // 401 에러면서, 아직 재시도 하지 않은 요청 경우 처리
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // refresh 엔드포인트 401 에러가 발생한 경우 (Unauthorized), 중복 재시도 방지를 위해 로그아웃 처리
            if (originalRequest.url?.includes("/v1/auth/refresh")) {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                window.location.href = "/login"; // 로그인 페이지로 리다이렉트
                return Promise.reject(error);
            }

            // 재시도 플래그 설정
            originalRequest._retry = true;

            // 이미 refresh 요청을 진행 중이면, 그 Promise를 재사용합니다.
            if (!refreshPromise) {
                // refresh 요청 실행 후, 프라미스를 전역 변수에 할당.
                refreshPromise = (async () => {
                    try {
                        const refreshTokenString = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);

                        if (!refreshTokenString) {
                            console.error('[Token Refresh] Refresh Token이 localStorage에 없음');
                            throw new Error("No refresh token available");
                        }

                        let refreshToken: string;
                        try {
                            refreshToken = JSON.parse(refreshTokenString);
                        } catch {
                            refreshToken = refreshTokenString;
                        }

                        // 순환 참조 방지를 위해 별도의 axios 인스턴스 사용
                        const { data } = await axios.post(
                            `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`,
                            { refresh: refreshToken }
                        );

                        // 새 토큰 저장 - CommonResponse 구조: { status, statusCode, message, data: { accessToken, refreshToken } }
                        const { accessToken, refreshToken: newRefreshToken } = data.data;

                        localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(accessToken));

                        if (newRefreshToken) {
                            localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, JSON.stringify(newRefreshToken));
                        }
                        return accessToken;
                    } catch (error) {
                        refreshPromise = null;
                        throw error;
                    }
                })();
            }

            // refresh 요청이 끝나면, 대기 중인 요청들을 재실행합니다.
            try {
                const token = await refreshPromise;
                refreshPromise = null;

                if (token) {
                    onRefreshed(token);
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                refreshPromise = null;
                onRefreshFailed();
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

    return Promise.reject(error);
}
);