import axios from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    // 생성 시점에는 Authorization 헤더를 설정하지 않습니다.
});

// 1. 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
    (config) => {
        // 2. 매번 요청이 보내지기 직전에 localStorage에서 accessToken을 가져옵니다.
        const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

        // 3. 토큰이 존재하면 헤더에 설정합니다.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // 요청 오류 처리
        return Promise.reject(error);
    }
);