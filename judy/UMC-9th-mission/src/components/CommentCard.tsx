import { useState } from "react";
import type { CommentItem } from "../types/comments";
import CommentSkeleton from "./CommentSkeleton";

interface CommentCardProps {
    comment: CommentItem;
}

export default function CommentCard({ comment }: CommentCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // 아바타가 없거나 이미지 로드 에러 시 즉시 표시
    const shouldShowContent = !comment.author.avatar || imageError || imageLoaded;

    // 이미지가 있는 경우에만 로딩 상태 관리
    if (comment.author.avatar && !shouldShowContent) {
        return <CommentSkeleton />;
    }

    return (
        <div className="flex gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
            {/* 작성자 아바타 */}
            <div className="flex-shrink-0">
                {comment.author.avatar && !imageError ? (
                    <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onLoad={() => setImageLoaded(true)}
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
                {/* 작성자 이름 */}
                <div className="flex items-center gap-2 mb-2">
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

                {/* 댓글 텍스트 */}
                <p className="text-gray-300 whitespace-pre-wrap break-words">
                    {comment.content}
                </p>
            </div>
        </div>
    );
}
