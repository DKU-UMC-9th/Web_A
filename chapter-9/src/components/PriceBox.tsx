import { useDispatch, useSelector } from "../hooks/useCustomRedux"
import { clearCart } from "../slices/cartSlice";

const PriceBox = () => {

    const { total } = useSelector((state) => state.cart)
    const dispatch = useDispatch();

    const handleClearCart = () => {
        dispatch(clearCart());
    }

    return (
        <div className="p-12 flex justify-between">
            <button onClick={handleClearCart} className="border p-4 rounded-md cursor-pointer">장바구니 초기화</button>
            <p>총액: {total}</p>
        </div>
    )
}

export default PriceBox