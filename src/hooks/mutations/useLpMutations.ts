import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLp, deleteLp, uploadImage, addLpLike, removeLpLike } from "../../apis/lp";
import type { Lp } from "../../types/lp";
import { useNavigate } from "react-router-dom";

export const useLpMutations = (lpid: string, myInfo?: { id: number }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // 이미지 업로드 mutation
    const uploadImageMutation = useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            console.error("이미지 업로드 실패:", error);
            alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // LP 수정 mutation
    const updateLpMutation = useMutation({
        mutationFn: ({ lpId, lpData }: { lpId: string; lpData: { title?: string; content?: string; thumbnail?: string; published?: boolean } }) => 
            updateLp(lpId, lpData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lps", lpid] });
            queryClient.invalidateQueries({ queryKey: ["lps"] });
            alert("LP가 성공적으로 수정되었습니다! ✨");
        },
        onError: (error) => {
            console.error("LP 수정 실패:", error);
            alert("LP 수정에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // LP 삭제 mutation
    const deleteLpMutation = useMutation({
        mutationFn: (lpId: string) => deleteLp(lpId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lps"] });
            alert("LP가 삭제되었습니다.");
            navigate("/");
        },
        onError: (error) => {
            console.error("LP 삭제 실패:", error);
            alert("LP 삭제에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // 좋아요 추가 mutation (Optimistic Update)
    const addLikeMutation = useMutation({
        mutationFn: () => addLpLike(lpid),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["lps", lpid] });
            const previousLp = queryClient.getQueryData<Lp>(["lps", lpid]);
            
            if (previousLp) {
                queryClient.setQueryData<Lp>(["lps", lpid], (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        likes: [
                            ...(old.likes || []),
                            {
                                id: Date.now(),
                                userId: myInfo?.id || 0,
                                lpId: old.id,
                                createdAt: new Date().toISOString(),
                            },
                        ],
                    };
                });
            }
            
            return { previousLp };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lps", lpid] });
            queryClient.invalidateQueries({ queryKey: ["lps"] });
        },
        onError: (error, _variables, context) => {
            if (context?.previousLp) {
                queryClient.setQueryData(["lps", lpid], context.previousLp);
            }
            console.error("좋아요 추가 실패:", error);
            alert("좋아요 추가에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // 좋아요 취소 mutation (Optimistic Update)
    const removeLikeMutation = useMutation({
        mutationFn: () => removeLpLike(lpid),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["lps", lpid] });
            const previousLp = queryClient.getQueryData<Lp>(["lps", lpid]);
            
            if (previousLp) {
                queryClient.setQueryData<Lp>(["lps", lpid], (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        likes: old.likes?.filter((like) => like.userId !== myInfo?.id) || [],
                    };
                });
            }
            
            return { previousLp };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lps", lpid] });
            queryClient.invalidateQueries({ queryKey: ["lps"] });
        },
        onError: (error, _variables, context) => {
            if (context?.previousLp) {
                queryClient.setQueryData(["lps", lpid], context.previousLp);
            }
            console.error("좋아요 취소 실패:", error);
            alert("좋아요 취소에 실패했습니다. 다시 시도해주세요.");
        },
    });

    return {
        uploadImageMutation,
        updateLpMutation,
        deleteLpMutation,
        addLikeMutation,
        removeLikeMutation,
    };
};
