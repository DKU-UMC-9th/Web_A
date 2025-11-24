//useThrottle: 주어진 값(상태)가 자주 변경될때
//최소 interval(밀리초) 간격으로 업데이트 해서 성능 개선
import { useEffect,useRef, useState } from "react";

function useThrottle<T>(value, delay=500){
    
}