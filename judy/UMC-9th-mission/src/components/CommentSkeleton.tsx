export default function CommentSkeleton() {
    return (
        <div className="flex gap-4 p-4 bg-gray-900 rounded-lg animate-pulse">
            {/* 아바타 */}
            <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"></div>

            {/* 댓글 내용 */}
            <div className="flex-1 space-y-2">
                {/* 작성자 이름 */}
                <div className="h-4 bg-gray-700 rounded w-24"></div>

                {/* 댓글 텍스트 */}
                <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>

                {/* 작성 시간 */}
                <div className="h-3 bg-gray-700 rounded w-32"></div>
            </div>
        </div>
    );
}
