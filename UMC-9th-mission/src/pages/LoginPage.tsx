
import { postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import useForm from "../hooks/useForm";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { validateSignin, type UserSigninInformation } from "../utils/validate";


const LoginPage = () => {
  const {setItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { values, getInputProps, errors, touched } =  
  useForm<UserSigninInformation>(
    { initialValues: { email: '', password: '' },
      validate: validateSignin, //유효성 검사 함수
    }
  )


  const handleSubmit = async() => { 
    console.log(values); 
    try{
    const response = await postSignin(values);
    setItem(response.data.accessToken);
    } catch (error) {
      alert(error?.message)
    }

    console.log(response);
  };
//오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
const isDisabled = Object.values(errors).some((error) => error.length > 0) || Object.values(values).some((value) => value === '');
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        <input 
          {...getInputProps('email')}
          name="email"
          className={`border border-[#ccc] w-[300px] p-[10px] foucus:border-[#807bff] rounded-sm ${errors?.email && touched.email ? 'border-red-500' : 'border-[#ccc]'}`}
          type={"email"}    
          placeholder="Email"    
        />
        {errors?.email && touched.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )} 
        <input 
            {...getInputProps('password')}
            className={`border border-[#ccc] w-[300px] p-[10px] foucus:border-[#807bff] rounded-sm ${errors?.password && touched.password ? 'border-red-500' : 'border-[#ccc]'}`}
          type={"password"}    
          placeholder="Password"    
        />
        {errors?.password && touched.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}
        <button type="button" onClick={handleSubmit}
         disabled={isDisabled}
         className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">Login</button>
      </div>
    </div>
  );
};
 
export default LoginPage

