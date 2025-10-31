import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
})
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