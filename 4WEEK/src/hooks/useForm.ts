import { useState, type ChangeEvent, useEffect } from "react";

interface UseFormProps<T> {
    initialValues: T;//값이 올바른지 검증 함수
    validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
    const [values, setValues] = useState(initialValues);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>();

    //사용자가 입력값을 바꿀 때 실행되는 함수
    const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values, //불변성 유지
      [name]: text,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [validate, values]);


  return { values, errors, touched, getInputProps };
}

export default useForm;