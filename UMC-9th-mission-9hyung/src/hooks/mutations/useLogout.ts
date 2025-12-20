import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"
import { useMutation } from "@tanstack/react-query";
import { postLogout } from "../../apis/auth";

export const useLogout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: postLogout,

        onSuccess: () => {
            logout();
            alert("로그아웃 성공");
            navigate("/login");
        },
        onError: () => {
            alert("로그아웃 실패");
        }
    })
}