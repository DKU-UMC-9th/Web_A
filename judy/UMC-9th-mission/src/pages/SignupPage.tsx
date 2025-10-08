import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const schema = z.object({
    email: z.string().email({message: "올바른 이메일 형식이 아닙니다."}),
    password: z.string()
        .min(8, {message: "비밀번호는 8자 이상이어야 합니다."})
        .max(20, {message: "비밀번호는 20자 이하여야 합니다."}),
    passwordCheck: z.string()
        .min(8, {message: "비밀번호는 8자 이상이어야 합니다."})
        .max(20, {message: "비밀번호는 20자 이하여야 합니다."}),
    name: z.string().min(1, {message : "이름을 입력해주세요."}),
}).refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
});

type FormFields = z.infer<typeof schema>

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<FormFields>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordCheck: "",
        },
        resolver: zodResolver(schema),
        mode: "onBlur"
    });

    const watchedValues = watch();

    // 모든 필드가 입력되었고, 에러가 없을 때만 버튼 활성화
    const isDisabled =
        !watchedValues.email ||
        !watchedValues.password ||
        !watchedValues.passwordCheck ||
        !watchedValues.name ||
        Object.keys(errors).length > 0 ||
        isSubmitting;

    const onSubmit:SubmitHandler<FormFields> = async (data) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordCheck, ...rest} = data;

        const response = await postSignup(rest);

        console.log(response);
    };

    return(
        <div className="flex flex-col items-center justify-center h-full gap-4 bg-[#000000]">
            <h1 className="text-2xl text-white font-semibold mb-8">회원가입</h1>

            {/* 이메일/비밀번호 입력 */}
            <div className="flex flex-col gap-4 w-[300px]">
                <input
                    {...register('email')}
                    type="email"
                    className={`border border-white w-full p-[10px] focus:outline-none focus:border-[#807bff] rounded-lg bg-black text-white placeholder:text-gray-400
                    ${errors.email ? "border-red-500 bg-red-900" : ""}`}
                    placeholder={"이메일"}
                />
                {errors.email && (
                    <div className={"text-red-500 text-sm"}>{errors.email.message}</div>
                )}
                <div className="relative w-full">
                    <input
                        {...register('password')}
                        type={showPassword ? "text" : "password"}
                        className={`border border-white w-full p-[10px] pr-10 focus:outline-none focus:border-[#807bff] rounded-lg bg-black text-white placeholder:text-gray-400
                        ${errors.password ? "border-red-500 bg-red-900" : ""}`}
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
                {errors.password && (
                    <div className={"text-red-500 text-sm"}>{errors.password.message}</div>
                )}
                <div className="relative w-full">
                    <input
                        {...register('passwordCheck')}
                        type={showPasswordCheck ? "text" : "password"}
                        className={`border border-white w-full p-[10px] pr-10 focus:outline-none focus:border-[#807bff] rounded-lg bg-black text-white placeholder:text-gray-400
                        ${errors.passwordCheck ? "border-red-500 bg-red-900" : ""}`}
                        placeholder={"비밀번호 확인"}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        {showPasswordCheck ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                    </button>
                </div>
                {errors.passwordCheck && (
                    <div className={"text-red-500 text-sm"}>{errors.passwordCheck.message}</div>
                )}
                <input
                    {...register('name')}
                    type="text"
                    className={`border border-white w-full p-[10px] focus:outline-none focus:border-[#807bff] rounded-lg bg-black text-white placeholder:text-gray-400
                    ${errors.name ? "border-red-500 bg-red-900" : ""}`}
                    placeholder={"이름"}
                />
                {errors.name && (
                    <div className={"text-red-500 text-sm"}>{errors.name.message}</div>
                )}
                <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isDisabled}
                    className="w-full bg-[#807bff] text-white py-3 rounded-lg text-lg font-medium hover:bg-[#605bff] transition-colors cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    회원가입
                </button>
            </div>
        </div>
    )
}