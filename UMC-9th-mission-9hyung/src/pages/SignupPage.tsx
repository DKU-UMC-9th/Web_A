import React from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { is } from "zod/locales";
import type { ResponseSignupDto } from "../types/auth";
import { postSignup } from "../apis/auth"; // postSignup 함수 import 추가
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하이어야 합니다.",
      }),
    passwordCheck: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하이어야 합니다.",
      }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onBlur", // 사용자가 입력할 때마다 즉시 유효성 검사
    });

    const password = watch("password");
    const passwordCheck = watch("passwordCheck");

    // 비밀번호 불일치 여부를 실시간으로 체크
    const isPasswordMismatch = passwordCheck && password !== passwordCheck;

    // 각 단계별 버튼 비활성화 여부를 실시간으로 계산합니다.
    const isStep1ButtonDisabled = !!errors.email;
    const isStep2ButtonDisabled = !password || !passwordCheck || !!errors.password || !!errors.passwordCheck || isPasswordMismatch;

    const handleNextStep = async () => {
        let isValidStep = false;
        if (step === 1) {
            isValidStep = await trigger("email");
        } else if (step === 2) {
            isValidStep = await trigger(["password", "passwordCheck"]);
        }
        if (isValidStep) {
            setStep((prev) => prev + 1);
        }
    };

    const handlePrevStep = () => {
        if (step === 1) {
            navigate(-1);
        } else {
            setStep((prev) => prev - 1);
        }
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { passwordCheck, ...rest } = data;
            await postSignup(rest);
            alert("회원가입이 완료되었습니다!");
            navigate("/");
        } catch (error) {
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
            console.error(error);
        }
    };

    return (
        <div className="w-full flex items-center justify-center p-4 sm:p-12">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-8">
                    <button onClick={handlePrevStep} className="text-2xl hover:text-blue-600 transition-colors">
                        &lt;
                    </button>
                    <h1 className="flex-1 text-center text-2xl font-bold">회원가입</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    
                    {/* --- 1단계: 이메일 입력 --- */}
                    {step === 1 && (
                        <>
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">이메일 주소</label>
                                <input id="email" type="email" placeholder="이메일을 입력해주세요."
                                    {...register("email")}
                                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={isStep1ButtonDisabled}
                                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md text-lg font-bold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                다음
                            </button>
                        </>
                    )}

                    {/* --- 2단계: 비밀번호 설정 --- */}
                    {step === 2 && (
                        <>
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">이메일 주소</label>
                                <input
                                    id="email" type="email" {...register("email")} disabled
                                    className="w-full px-4 py-3 border rounded-md border-gray-300 bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">비밀번호</label>
                                <div className="relative">
                                    <input id="password" type={showPassword ? "text" : "password"} placeholder="비밀번호를 입력해주세요."
                                        {...register("password")}
                                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 text-gray-500 text-sm cursor-pointer">
                                        {/* 아이콘 로직 수정: 보일 때(true) IoEyeOutline, 숨길 때(false) IoEyeOffOutline */}
                                        {showPassword ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="passwordCheck" className="block text-sm font-bold text-gray-700 mb-1">비밀번호 확인</label>
                                <div className="relative">
                                    {/* 불필요한 validate 옵션을 제거하고 Zod 스키마에만 의존합니다. */}
                                    <input id="passwordCheck" type={showPasswordCheck ? "text" : "password"} placeholder="비밀번호를 다시 한 번 입력해주세요."
                                        {...register("passwordCheck",)}
                                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.passwordCheck || isPasswordMismatch ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                    />
                                    <button type="button" onClick={() => setShowPasswordCheck(!showPasswordCheck)} className="absolute inset-y-0 right-0 px-3 text-gray-500 text-sm cursor-pointer">
                                        {/* 아이콘 로직 수정 */}
                                        {showPasswordCheck ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                                    </button>
                                </div>
                                {errors.passwordCheck && <p className="text-red-500 text-xs mt-1">{errors.passwordCheck.message}</p>}
                                {!errors.passwordCheck && isPasswordMismatch && <p className="text-red-500 text-xs mt-1">비밀번호가 일치하지 않습니다.</p>}
                            </div>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={!!isStep2ButtonDisabled}
                                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md text-lg font-bold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                다음
                            </button>
                        </>
                    )}

                    {/* --- 3단계: 닉네임 설정 --- */}
                    {step === 3 && (
                        <>
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative size-32 bg-gray-200 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                    <div className="absolute bottom-1 right-1 bg-gray-700 p-2 rounded-full cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                                <input id="name" type="text" placeholder="이름을 입력해주세요."
                                    {...register("name")}
                                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md text-lg font-bold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                회원가입 완료
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
