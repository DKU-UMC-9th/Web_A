import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ImageUpLoadBox from "./ImageUploadBox";
import { usePostLpCreate } from "../hooks/mutations/usePostLpCreate";

interface AddLpModalProps {
  onClose: () => void;
}

export default function AddLpModal({ onClose }: AddLpModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const previewUrl = thumbnail ? URL.createObjectURL(thumbnail) : null;

  const { mutate, isPending } = usePostLpCreate(onClose);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const addTag = () => {
    if (tag.trim().length === 0) return;
    setTags((prev) => [...prev, tag.trim()]);
    setTag("");
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) return alert("제목을 입력하세요!");
    if (!content.trim()) return alert("내용을 입력하세요!");
    

    mutate({
      title,
      content,
      thumbnail: thumbnail ?  "": "https://picsum.photos/400",
      tags,
      published: true,
    });
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div
        ref={modalRef}
        className="bg-[#2b2b2b] text-white w-[420px] p-6 rounded-xl shadow-xl relative"
      >
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-300 hover:text-white text-xl cursor-pointer"
        >
          ✕
        </button>

        <ImageUpLoadBox
          previewUrl={previewUrl}
          onChange={(file) => setThumbnail(file)}
        />

        <div className="mt-6">
          {/* 제목 */}
          <input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#1e1e1e] px-3 py-2 rounded-md mb-3"
          />

          {/* 내용 */}
          <input
            type="text"
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#1e1e1e] px-3 py-2 rounded-md mb-3"
          />
        </div>

        {/* 태그 */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="LP Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="flex-1 bg-[#1e1e1e] px-3 py-2 rounded-md"
          />
          <button
            onClick={addTag}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-400 rounded-md cursor-pointer"
          >
            Add
          </button>
        </div>

        {/* 태그 리스트 */}
        <div className="flex gap-2 flex-wrap mb-4">
          {tags.map((t, i) => (
            <span
              key={i}
              className="px-3 py-2 bg-[#464646] rounded-md text-sm flex items-center gap-2"
            >
              #{t}
              <button
                onClick={() => removeTag(i)}
                className="text-red-600 hover:text-red-400 text-xs   px-1 cursor-pointer"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* LP 추가 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full bg-blue-600 py-3 rounded-md font-semibold hover:bg-blue-500 cursor-pointer"
        >
          {isPending ? "등록 중..." : "Add LP"}
        </button>
      </div>
    </div>,
    document.body,
  );
}
