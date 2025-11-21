import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, updateComment, deleteComment } from "../../apis/lp";

export const useCommentMutations = (lpid: string) => {
    const queryClient = useQueryClient();

    // 댓글 작성 mutation
    const createCommentMutation = useMutation({
        mutationFn: (content: string) => createComment(lpid, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
        },
        onError: (error) => {
            console.error("댓글 작성 실패:", error);
            alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // 댓글 수정 mutation
    const updateCommentMutation = useMutation({
        mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
            updateComment(lpid, commentId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
        },
        onError: (error) => {
            console.error("댓글 수정 실패:", error);
            alert("댓글 수정에 실패했습니다. 다시 시도해주세요.");
        },
    });

    // 댓글 삭제 mutation
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: number) => deleteComment(lpid, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
        },
        onError: (error) => {
            console.error("댓글 삭제 실패:", error);
            alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
        },
    });

    return {
        createCommentMutation,
        updateCommentMutation,
        deleteCommentMutation,
    };
};
