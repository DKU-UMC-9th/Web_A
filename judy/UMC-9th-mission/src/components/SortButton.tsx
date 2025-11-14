import { useState } from "react";
import type { SortOrder } from "../apis/lps";

interface SortButtonProps {
    onSortChange?: (order: SortOrder) => void;
}

export default function SortButton({ onSortChange }: SortButtonProps) {
    const [selectedSort, setSelectedSort] = useState<SortOrder>("newest");

    const handleSortClick = (order: SortOrder) => {
        setSelectedSort(order);
        if (onSortChange) {
            onSortChange(order);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => handleSortClick("oldest")}
                className={`px-4 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                    selectedSort === "oldest"
                        ? "bg-white text-black"
                        : "bg-black text-white"
                }`}
            >
                오래된순
            </button>
            <button
                onClick={() => handleSortClick("newest")}
                className={`px-4 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                    selectedSort === "newest"
                        ? "bg-white text-black"
                        : "bg-black text-white"
                }`}
            >
                최신순
            </button>
        </div>
    );
}
