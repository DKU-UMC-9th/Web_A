import { useEffect, useRef } from "react";

interface SearchBarProps {
  search: string;
  setSearch: (v: string) => void;
  large?: boolean;   // SearchPage에서 네이버 스타일 큰 검색창용
}

export default function SearchBar({
  search,
  setSearch,
  large = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div
      className={`
        w-full
        ${large ? "h-14" : "h-10"}
        bg-white
        shadow-md
        rounded-lg
        px-4
        flex items-center gap-3
        text-black
        font-semibold
      `}
    >
      <span>🔍</span>

      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="flex-1 bg-transparent outline-none"
      />
    </div>
  );
}
