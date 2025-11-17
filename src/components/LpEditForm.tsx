import { useRef, type ChangeEvent } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface LpEditFormProps {
    title: string;
    content: string;
    imageFile: File | null;
    onTitleChange: (value: string) => void;
    onContentChange: (value: string) => void;
    onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isPending: boolean;
}

export default function LpEditForm({
    title,
    content,
    imageFile,
    onTitleChange,
    onContentChange,
    onImageChange,
    onSubmit,
    onCancel,
    isPending,
}: LpEditFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            {/* 제목 입력 */}
            <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white text-3xl font-bold rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                placeholder="제목을 입력하세요"
                maxLength={100}
            />

            {/* 내용 입력 */}
            <textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 resize-none"
                placeholder="내용을 입력하세요"
                rows={6}
                maxLength={1000}
            />

            {/* 이미지 변경 버튼 */}
            <div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                    📷 이미지 변경
                </button>
                {imageFile && (
                    <span className="ml-2 text-sm text-gray-400">
                        {imageFile.name}
                    </span>
                )}
            </div>

            {/* 수정 액션 버튼 */}
            <div className="flex gap-2 pt-4">
                <button
                    onClick={onSubmit}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors text-sm disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    <FaCheck />
                    {isPending ? "저장 중..." : "저장"}
                </button>
                <button
                    onClick={onCancel}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm disabled:cursor-not-allowed"
                >
                    <FaTimes />
                    취소
                </button>
            </div>
        </>
    );
}
