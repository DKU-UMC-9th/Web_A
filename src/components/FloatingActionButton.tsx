import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

export default function FloatingActionButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/create")}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            aria-label="LP 만들기"
        >
            <FaPlus size={24} />
        </button>
    );
}
