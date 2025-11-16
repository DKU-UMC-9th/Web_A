import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import {Heart} from "lucide-react";

const LpDetailPage=()=>{
    const {lpId}=useParams();
    const{accessToken}=useAuth();
    const {data: lp ,isPending,isError}=useGetLpDetail({lpId:Number(lpId)})
    const{data:me}=useGetMyInfo(accessToken);

    
    if(isPending&&isError){
        return <></>
    }
    
    return <div className="mt-12">
        <h1>{lp?.data.title}</h1>
        <img src={lp?.data.thembnail} alt={lp?.data.title}/>
        <p>{lp?.data.content}</p>

        <button>
            <Heart/>
        </button>
        </div>
};


export default LpDetailPage;