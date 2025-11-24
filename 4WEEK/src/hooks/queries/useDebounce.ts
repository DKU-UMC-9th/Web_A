import { useEffect, useState } from "react";

function useDedounce<T>(value:T, delay:humber){
    const[debouncedValue:T, setDebouncedValue]=useState<T>(value)

    //value,delay가 변경될때마다 실행
    useEffect(effect:()=>{
        //delay(ms)후에 실행
        //delay 시간 후에 value를 debounceValue로 업데이트하는 타이머 시작
        const handler:number = setTimeout(handler:()=>setDebouncedValue(value),delay)

        //value가 변경되면, 기존 타이머를 지워서 업데이트를 취소
        //값이 계속 바뀔때마다 마지막에 멈춘 값만 업데이트
        return () => clearTimeout(handler);
    }, deps:[value,delay]);
    //최종적으로 잠시 대기 후 갑을 반환
    return debouncedValue;
}
export default useDedounce;