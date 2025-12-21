import { openModal } from "../features/modal/modalSlice";
import { useCartInfo } from "../hooks/useCartStore";
import { useDispatch, useSelector } from "../hooks/useCustomRedux"
import { useModalStore } from "../hooks/useModalStore";

const PriceBox = () => {

    const { total } = useCartInfo()
    const { openModal } = useModalStore();
    
    return (
        <div className="p-12 flex justify-between">
            <button onClick={openModal} className="border p-4 rounded-md cursor-pointer text-red-500 border-red-500 hover:bg-red-50">
                장바구니 초기화
            </button>
            <p>총액: {total} 원</p>
        </div>
    )
}

export default PriceBox