import { useState } from "react";
import type { CommentItem } from "../types/comments";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";

interface CommentCardProps {
    comment: CommentItem;
    currentUserId?: number;
    onUpdate: (commentId: number, content: string) => void;
    onDelete: (commentId: number) => void;
}

export default function CommentCard({ comment, currentUserId, onUpdate, onDelete }: CommentCardProps) {
    const [imageError, setImageError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [showMenu, setShowMenu] = useState(false);

    const isOwner = currentUserId === comment.author.id;

    const handleUpdate = () => {
        if (editContent.trim() && editContent !== comment.content) {
            onUpdate(comment.id, editContent);
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        onDelete(comment.id);
        setShowMenu(false);
    };

    return (
        <div className="flex gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
            {/* 작성자 아바타 */}
            <div className="flex-shrink-0">
                {comment.author.avatar && !imageError ? (
                    <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                        {comment.author.name[0].toUpperCase()}
                    </div>
                )}
            </div>

            {/* 댓글 내용 */}
            <div className="flex-1">
                {/* 작성자 이름 및 메뉴 */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                            {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>

                    {/* 본인 댓글일 때만 메뉴 버튼 표시 */}
                    {isOwner && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                            >
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* 메뉴 드롭다운 */}
                            {showMenu && (
                                <div className="absolute right-0 mt-1 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setShowMenu(false);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        수정
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        삭제
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 댓글 텍스트 / 수정 입력창 */}
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-gray-800 text-white rounded-lg p-3 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(comment.content);
                                }}
                                className="px-4 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-1 text-sm bg-pink-500 hover:bg-pink-600 text-white rounded transition-colors"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-300 whitespace-pre-wrap break-words">
                        {comment.content}
                    </p>
                )}
            </div>
        </div>
    );
}
