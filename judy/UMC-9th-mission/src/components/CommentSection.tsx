import { useState } from "react";

interface CommentSectionProps {
    order: "asc" | "desc";
    onOrderChange: (order: "asc" | "desc") => void;
}

export default function CommentSection({ order, onOrderChange }: CommentSectionProps) {
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        // TODO: 댓글 작성 API 호출
        setComment("");
    };

    return (
        <div className="space-y-4">
            {/* 헤더: 댓글 제목 + 정렬 버튼 */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">댓글</h2>

                {/* 정렬 버튼 */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onOrderChange("desc")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            order === "desc"
                                ? "bg-pink-500 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        최신순
                    </button>
                    <button
                        onClick={() => onOrderChange("asc")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            order === "asc"
                                ? "bg-pink-500 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        오래된순
                    </button>
                </div>
            </div>

            {/* 댓글 작성란 */}
            <div className="bg-gray-900 rounded-lg p-4">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    className="w-full bg-gray-800 text-white rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-gray-400"
                />
                <div className="flex justify-end mt-3">
                    <button
                        onClick={handleSubmit}
                        disabled={!comment.trim()}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        작성
                    </button>
                </div>
            </div>
        </div>
    );
}
