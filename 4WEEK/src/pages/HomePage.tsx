import { PAGINATION_ORDER } from "../enums/common";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import {useInView} from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard.tsx";
import useDedounce from "../hooks/queries/useDebounce.ts";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList.tsx";

const HomePage = () => {
    const[search,setSearch]= useState(initialState:"");
    const{
        data:lps,
        isFetching,
        hasNextPage,
        isPending,
        fetchNextPage,
        isError,
    }=useGetInfiniteLpList(limit:10,search,PAGINATION_ORDER_asc);
    //ref:InView
    //ref->특정한 HTML 요소를 감시할 수 있다
    //InView->그 요소가 화면에 보이면 true
    const{ref,inView}=useinView({threshold,delay,trackVisibility,rootMargin,root,triggerOnce, skip, initiaInView,fallbackInView, onChange}:{
        threshold:0,
    });
    useEffect(effect:()=>{
        if(inView){
            lisFetching&&hasNextPage&&fetchNextPage();
        }
    }, deps:[inView, isFetchingmhasNextPage, fetchNextPage]);
    if(isError){
        return<div className={"mt-20"}>Error...</div>;
    }
    return(
        <div className="w-full flex flex-col items-center justify-center text-center gap-15">
            <h1 className="text-6xl font-extrabold text-blue-600 drop-shadow-lg">
                Jiwoo Home
            </h1>
            <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white font-bold text-lg px-12 py-2.5 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition-transform hover:scale-105"
            >
                로그인
            </button>
            <button
                onClick={() => navigate("/sign")}
                className="bg-white text-blue-600 font-bold text-lg px-12 py-2.5 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition-transform hover:scale-105"
            >
                회원가입
            </button>
        </div>
    );
};
export default HomePage;