import { useRef } from "react";

interface ImageUploadBoxProps {
  previewUrl: string | null;
  onChange: (file: File | null) => void;
}

export default function ImageUpLoadBox({
  previewUrl,
  onChange,
}: ImageUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 등록된 이미지가 있을 때 */}
      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            className="w-48 h-48 rounded-xl object-cover shadow-md border border-gray-300"
            alt="preview"
          />
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 cursor-pointer"
          >
            이미지 변경
          </button>
        </>
      ) : (
        <>
          {/* 등록된 이미지가 없을 때 */}
          <div
            className="w-48 h-48 flex flex-col items-center justify-center bg-gray-200 
            rounded-xl text-center shadow-inner border border-gray-300 cursor-pointer hover:bg-gray-300 transition"
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3h-4m0 0H8m4 0v4m7 4h-4m0 0H8m4 0v4"
              />
            </svg>
            <p className="text-sm text-gray-600">
              등록된 이미지가 없습니다.
              <br />
              이미지를 추가해주세요.
            </p>
          </div>
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 cursor-pointer"
          >
            이미지 추가
          </button>
        </>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
