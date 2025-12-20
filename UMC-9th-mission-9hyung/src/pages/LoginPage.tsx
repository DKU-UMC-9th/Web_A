import React, { useEffect } from "react";

import { type UserSigninInformation, validateSignin } from "../utils/validate";
import useForm from "../hooks/useForm";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSignin } from "../hooks/mutations/useSignin";

const LoginPage = () => {
  // const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 이전 페이지 경로 기억 (ProtectedLayout에서 전달한 from)
  const from = (location.state as { from?: string })?.from || "/";

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validiate: validateSignin,
    });

  // const handleSubmit = async () => {
  //   console.log("🧩 useAuth() 결과:", useAuth);
  //   console.log("🧩 useAuth().login:", login);
  //   try {
  //     await login(values);
  //     const from = location.state?.from || "/"; // 👈 기본값을 "/" (홈)으로 변경

  //     // ✅ 로그인 성공 후 원래 경로(from)로 복귀
  //     navigate(from, { replace: true });
  //   } catch {
  //     alert("로그인 실패");
  //   }
  // };

  const signin = useSignin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signin.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          navigate(from, { replace: true });
        },
      },
    );
  };

  const handleGoogleLogin = () => {
    const redirectUrl =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";

    // ✅ 백엔드가 redirect 파라미터를 무시해도 대비용으로 localStorage에 저장
    localStorage.setItem("google_login_redirect_path", from);
    // ✅ 구글 로그인 후 돌아올 redirect도 설정 가능
    window.location.href = `${redirectUrl}?redirect=${encodeURIComponent(
      from,
    )}`;
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="w-full flex items-center justify-center p-12">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl hover:text-blue-600 cursor-pointer transition-colors"
          >
            &lt;
          </button>
          <h1 className="flex-1 text-center text-2xl font-bold">로그인</h1>
        </div>

        <form className="flex flex-col gap-4">
          {/* 이메일 입력 필드 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              이메일 주소
            </label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요."
              {...getInputProps("email")}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
                  errors?.email && touched?.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
            />
            {errors?.email && touched?.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 입력 필드 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              {...getInputProps("password")}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
                  errors?.password && touched?.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
            />
            {errors?.password && touched?.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* 로그인 유지 체크박스 */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              로그인 유지
            </label>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            //disabled={isDisabled}
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-bold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            로그인
          </button>
        </form>

        {/* "또는" 구분선 */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">또는</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        {/* 구글 로그인 버튼 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          //disabled={isDisabled}
          className="w-full flex items-center justify-center gap-5 py-3 border cursor-pointer border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google icon"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-bold">구글 로그인</span>
        </button>

        {/* 회원가입 링크 */}
        <div className="text-center mt-6">
          <span className="text-sm font-semibold text-gray-600">
            처음 방문이신가요?{" "}
          </span>
          <Link
            to="/signup"
            className="text-sm font-bold text-blue-600 "
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
