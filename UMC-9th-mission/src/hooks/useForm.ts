import { useEffect, useState } from "react";

interface useFormProps<T> {
    initialValues: T; //{email:'', password:''}
    //값이 올바른지 검증하는 함수
    validate: (values: T) => Record<keyof T, string>;
    }

function useForm<T>({ initialValues, validate }: useFormProps<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
//사용자가 입력값을 바꿀 때 실행되는 함수
    const handleChange = (name: keyof T, text: string) => {
        setValues({ ...values,//불변성 유지(기존 값유지)
             [name]: text });
    };

    const handleBlur = (name: keyof T) => {
        setTouched({ ...touched, [name]: true });
    };

    //이메일 인풋, 패스워드 인풋, 속성들을 좀 가져오는것
    const getInputProps = (name: keyof T) => {
        const value = values[name];
        const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
            handleChange(name, e.target.value);

        const onBlur = () => handleBlur(name);

        return {value, onChange, onBlur}
};
//values 가 변경될때 마다 에러 검증 로직이 실행됨
//{emailㅣ:""}
    useEffect(() => {
        const newErrors = validate(values);
        setErrors(newErrors); //오류메시지 업뎃
    }, [validate, values]);

    return { values, errors, touched, getInputProps };
}

export default useForm;