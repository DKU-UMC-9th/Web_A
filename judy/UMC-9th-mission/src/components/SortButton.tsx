import type { SortOrder } from "../apis/lps";

interface SortButtonProps {
    currentSort: SortOrder;
    onSortChange: (order: SortOrder) => void;
}

export default function SortButton({ currentSort, onSortChange }: SortButtonProps) {
    const handleSortClick = (order: SortOrder) => {
        onSortChange(order);
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => handleSortClick("oldest")}
                className={`px-4 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                    currentSort === "oldest"
                        ? "bg-white text-black"
                        : "bg-black text-white"
                }`}
            >
                오래된순
            </button>
            <button
                onClick={() => handleSortClick("newest")}
                className={`px-4 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                    currentSort === "newest"
                        ? "bg-white text-black"
                        : "bg-black text-white"
                }`}
            >
                최신순
            </button>
        </div>
    );
}
