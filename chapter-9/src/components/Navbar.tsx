import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { useEffect } from "react";
import { calculateTotal } from "../slices/cartSlice";
import cartItems from "../constants/cartItems";

export default function Navbar() {
    const { amount, cartItems } = useSelector((state) => state.cart)

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(calculateTotal())
    }, [dispatch, cartItems])

    return (
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 onClick={() => {
                window.location.href = "/"
            }} className="cursor-pointer">Navbar</h1>
            <div className="flex items-center space-x-2">
            <FaShoppingCart className="text-2xl" />
            <span>{amount}</span>
            </div>
        </div>
    )
}