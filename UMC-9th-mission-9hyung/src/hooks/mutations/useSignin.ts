import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import type { RequestSigninDto } from "../../types/auth";

export const useSignin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (body: RequestSigninDto) => postSignin(body),
    onSuccess: (res) => {
      const access = res.data.accessToken;
      const refresh = res.data.refreshToken;

      login(access, refresh);

      navigate("/");
    },

    onError: () => {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    },
  });
};
