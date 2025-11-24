import { useEffect, useState } from "react";
const ThrottlePage=()=>{
    const [scrollY,setScrollY]= useState<number>();

    const handleScroll = useThrottle(()=>{
        setScrollY(window.scrollY);
    },2000);
    useEffect(()=>{
        window.addEventListener("scroll",handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll];
    console.log("리렌더링");

    return(
        <div className="h-dvh flex flex-col items-center justify-center">
            <div>
                <h1>쓰로틀링</h1>
                <p>ScrollY: {scrollY}px</p>
            </div>
        </div>
    )

)
}   
export default ThrottlePage;