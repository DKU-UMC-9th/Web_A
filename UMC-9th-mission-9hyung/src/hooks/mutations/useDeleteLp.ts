import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export default function useDeleteLp(lpId: number, onSuccess?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteLp(lpId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps]});

            if (onSuccess) onSuccess();
        }
    })
}