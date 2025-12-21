import { openModal } from "../features/modal/modalSlice";
import { useDispatch, useSelector } from "../hooks/useCustomRedux"

const PriceBox = () => {

    const { total } = useSelector((state) => state.cart)
    const dispatch = useDispatch();

    const handleOpenModal = () => {
        dispatch(openModal())
    }

    return (
        <div className="p-12 flex justify-between">
            <button onClick={handleOpenModal} className="border p-4 rounded-md cursor-pointer text-red-500 border-red-500 hover:bg-red-50">
                장바구니 초기화
            </button>
            <p>총액: {total} 원</p>
        </div>
    )
}

export default PriceBox