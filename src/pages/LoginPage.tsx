import type { UserSigninInformation } from "../utils/validate";
import { validateSignin } from "../utils/validate";
import useForm from "../hooks/useForm";
import { IoChevronBack } from "react-icons/io5";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    })

    const handleSubmit = async () => {
        await login(values);

    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/google/login`;
    };

    // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
    const isDisabled =
        Object.values(errors || {}).some((error : string) => error.length > 0) ||
        Object.values(values).some((value : string) => value === "");

    return(
        <div className="flex flex-col items-center justify-center h-full gap-4 bg-[#000000]">
            <div className="w-[300px] relative flex items-center justify-center mb-8">
                <IoChevronBack className="absolute left-0 text-2xl cursor-pointer text-white" />
                <h1 className="text-2xl text-white font-semibold">로그인</h1>
            </div>

            {/* 구글 로그인 버튼 */}
            <button className="w-[300px] relative flex items-center justify-center bg-black border border-white rounded-lg py-3 hover:bg-gray-800 text-white cursor-pointer"
                    onClick={handleGoogleLogin}>
                <svg className="w-5 h-5 absolute left-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>구글 로그인</span>
            </button>

            {/* OR 구분선 */}
            <div className="flex items-center my-6 w-[300px]">
                <hr className="flex-1 border-white" />
                <span className="px-3 text-white">OR</span>
                <hr className="flex-1 border-white" />
            </div>

            {/* 이메일/비밀번호 입력 */}
            <div className="flex flex-col gap-8 w-[300px]">
                <input
                    {...getInputProps('email')}
                    name="email"
                    type={"email"}
                    className={`border border-white w-full p-[10px] focus:outline-none focus:border-[#807bff] rounded-lg bg-black text-white placeholder:text-gray-400
                    ${errors?.email && touched?.email ? "border-red-500 bg-red-900" : ""}`}
                    placeholder={"이메일"}
                />
                {errors?.email && touched.email && (
                    <div className="text-red-400 text-sm">{errors.email}</div>
                )}
                <div className="relative w-full">
                    <input
                        {...getInputProps('password')}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`border border-white w-full p-[10px] pr-10 focus:outline-none focus:border-[#807bff] rounded-lg bg-black text-white placeholder:text-gray-400
                        ${errors?.password && touched?.password ? "border-red-500 bg-red-900" : ""}`}
                        placeholder={"비밀번호"}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                    </button>
                </div>
                {errors?.password && touched.password && (
                    <div className="text-red-400 text-sm">{errors.password}</div>
                )}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className="w-full bg-[#807bff] text-white py-3 rounded-lg text-lg font-medium hover:bg-[#605bff] transition-colors cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    로그인
                </button>
            </div>
        </div>
    )
}