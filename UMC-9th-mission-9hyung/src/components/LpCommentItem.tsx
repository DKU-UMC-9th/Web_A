import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import type { CommentItem } from "../types/lpComments";
import useEditComment from "../hooks/mutations/useEditComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";

interface Props {
  comment: CommentItem;
  lpId: number;
}

export default function LpCommentItem({ comment, lpId }: Props) {
  const { accessToken } = useAuth();
  const { data: me } = useGetMyInfo(accessToken);

  const author = comment.author;
  const avatar = author?.avatar;
  const name = author?.name ?? "익명";

  const isMyComment = author?.id === me?.data.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const editComment = useEditComment(lpId);
  const deleteCommentMutate = useDeleteComment(lpId);

  const handleSaveEdit = () => {
    editComment.mutate(
      {
        commentId: comment.id,
        body: { content: editText },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleDelete = () => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    deleteCommentMutate.mutate(comment.id);
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-700 hover:bg-gray-800 rounded-md px-2">
      {/* 아바타 */}
      <div className="flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
            {name[0].toUpperCase()}
          </div>
        )}
      </div>

      {/* 댓글 본문 */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-white text-sm">{name}</span>
          <span className="text-xs text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              className="w-full bg-gray-900 text-gray-200 p-2 rounded-md"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md cursor-pointer"
              >
                저장
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}
      </div>

      {/* 수정/삭제 버튼 */}
      {isMyComment && !isEditing && (
        <div className="flex flex-col gap-1 ml-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-gray-400 hover:text-white cursor-pointer"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-red-400 hover:text-red-200 cursor-pointer"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
