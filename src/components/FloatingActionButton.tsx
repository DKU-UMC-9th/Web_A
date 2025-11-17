import { FaPlus } from "react-icons/fa";

interface FloatingActionButtonProps {
    onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            aria-label="LP 만들기"
        >
            <FaPlus size={24} />
        </button>
    );
}
