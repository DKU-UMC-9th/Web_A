import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/user";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../context/AuthContext";

function useGetMyInfo() {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: [QUERY_KEY.me],
        queryFn: getMyInfo,
        enabled: !!accessToken, // accessToken이 있을 때만 호출
        retry: false, // 실패 시 재시도 안 함
    });
}

export default useGetMyInfo;
