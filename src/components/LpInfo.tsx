import { FaHeart, FaRegHeart, FaEdit, FaTrash } from "react-icons/fa";
import type { Lp } from "../types/lp";

interface LpInfoProps {
    lp: Lp;
    isLiked: boolean;
    isMyLp: boolean;
    onLikeToggle: () => void;
    onEditStart: () => void;
    onDelete: () => void;
}

export default function LpInfo({ lp, isLiked, isMyLp, onLikeToggle, onEditStart, onDelete }: LpInfoProps) {
    return (
        <>
            {/* 제목 */}
            <h1 className="text-3xl md:text-4xl font-bold">{lp.title}</h1>

            {/* 메타 정보 */}
            <div className="flex items-center gap-6 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                    <span>업로드일</span>
                    <span className="text-white">
                        {new Date(lp.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-pink-400">❤️</span>
                    <span className="text-white font-semibold">{lp.likes?.length || 0}</span>
                </div>
            </div>

            {/* 태그 */}
            {lp.tags && lp.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {lp.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
                        >
                            #{tag.name}
                        </span>
                    ))}
                </div>
            )}

            {/* 본문 내용 */}
            <div className="py-4">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                    {lp.content || "등록된 내용이 없습니다."}
                </p>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex gap-2 pt-4 border-t border-gray-800">
                {/* 좋아요 버튼 */}
                <button
                    onClick={onLikeToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${
                        isLiked
                            ? "bg-pink-500 hover:bg-pink-600 text-white"
                            : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                >
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span>좋아요 {lp.likes?.length || 0}</span>
                </button>

                {/* 본인 LP인 경우에만 수정/삭제 버튼 표시 */}
                {isMyLp && (
                    <>
                        {/* 수정 버튼 */}
                        <button
                            onClick={onEditStart}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
                        >
                            <FaEdit />
                            <span>수정</span>
                        </button>

                        {/* 삭제 버튼 */}
                        <button
                            onClick={onDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                        >
                            <FaTrash />
                            <span>삭제</span>
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
