import { clearCart } from "../features/cart/cartSlice";
import { closeModal } from "../features/modal/modalSlice";
import { useCartActions } from "../hooks/useCartStore";
import { useDispatch } from "../hooks/useCustomRedux"
import { useModalStore } from "../hooks/useModalStore";

const Modal = () => {
    const { closeModal } = useModalStore();
    const { clearCart } = useCartActions();

    return (
        <aside className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
            <div className="bg-white w-80 p-8 rounded-lg text-center shadow-lg">
                <h4 className="font-bold text-lg mb-4">정말 삭제하시겠습니까?</h4>
                <div className="flex justify-center space-x-4 mt-6">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                    >
                        아니요
                    </button>
                    <button
                        onClick={() => {
                            clearCart();
                            closeModal();
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        네
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default Modal;