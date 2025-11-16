import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../../apis/user";

export const useDeleteUser = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return useMutation({
        mutationFn: deleteUser,
        
        onSuccess: () => {
            logout();
            navigate("/login");
        },

        onError: () => {
            alert("회원탈퇴를 실패하였습니다.");
        }
    })
}