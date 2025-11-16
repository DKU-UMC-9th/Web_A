import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RequestPatchUser } from "../../types/user";
import { patchUserInfo } from "../../apis/user";
import { QUERY_KEY } from "../../constants/key";

export default function usePatchUserInfo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: RequestPatchUser) => patchUserInfo(body),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:[QUERY_KEY.myInfo]})
        }
    })
}