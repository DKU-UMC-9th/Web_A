import { useForm, type SubmitHandler } from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import { postSignup } from '../apis/auth';

const schema = z.object({
  email: z.string().email({message: '이메일 형식이 올바르지 않습니다.'}),
  password: z.string()
  .min(8, {message: '비밀번호는 8자에서 20자 사이로 입력해주세요.'})
  .max(20, {message: '비밀번호는 8자에서 20자 사이로 입력해주세요.'}),
  passwordCheck: z.string()
  .min(8, {message: '비밀번호는 8자에서 20자 사이로 입력해주세요.'})
  .max(20, {message: '비밀번호는 8자에서 20자 사이로 입력해주세요.'}),
  name: z.string().min(1, {message: '이름을 입력해주세요.'})
         

})
.refine((data)=>data.password===data.passwordCheck, 
         {message: '비밀번호가 일치하지 않습니다.',
          path: ['passwordCheck'],
         });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const {register, handleSubmit, 
    formState :{errors,isSubmitting}} = useForm<FormFields>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordCheck: '',
    },
    resolver : zodResolver(schema),
    mode: 'onBlur', //blur:포커스가 벗어났을때, change:입력값이 변경될때, submit:제출할때
});
  const onSubmit:SubmitHandler<FormFields> = async(data) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {passwordCheck, ...rest} = data;
    const response = await postSignup(rest);
    console.log(response);
  };
  return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        <input 
          {...register('email')}
          className={`border border-[#ccc] w-[300px] p-[10px] foucus:border-[#807bff] rounded-sm ${errors?.email ? 'border-red-500' : 'border-[#ccc]'}`}
          type={"email"}    
          placeholder="Email"    
        />   
        {errors?.email && (
          <div className="text-red-500 text-sm">{errors.email.message}</div>
        )}
        <input 
            {...register('password')}
            className={`border border-[#ccc] w-[300px] p-[10px] foucus:border-[#807bff] rounded-sm ${errors?.password ? 'border-red-500' : 'border-[#ccc]'}`}
          type={"password"}    
          placeholder="Password"    
        />
        {errors?.password && (
          <div className="text-red-500 text-sm">
            {errors.password.message}
          </div>
        )}
        <input 
            {...register('passwordCheck')}
            className={`border border-[#ccc] w-[300px] p-[10px] foucus:border-[#807bff] rounded-sm ${errors?.passwordCheck ? 'border-red-500' : 'border-[#ccc]'}`}
          type={"password"}    
          placeholder="passwordCheck"    
        />
        {errors?.passwordCheck && (
          <div className="text-red-500 text-sm">
            {errors.passwordCheck.message}
          </div>
        )}
        <input 
            {...register('name')}
            className={`border border-[#ccc] w-[300px] p-[10px] foucus:border-[#807bff] rounded-sm 
              ${errors?.name ? 'border-red-500' : 'border-[#ccc]'}`}
          type={"name"}    
          placeholder="이름"    
        />
        {errors?.name && (
          <div className="text-red-500 text-sm">
            {errors.name.message}
          </div> 
        )}
        
        <button 
         disabled={isSubmitting}
         type="button" 
         onClick={handleSubmit(onSubmit)}
         className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">회원가입</button>
      </div>
    </div>
  )
}

export default SignupPage

