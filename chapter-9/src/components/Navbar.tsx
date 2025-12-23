import { FaShoppingCart } from "react-icons/fa";
import { useEffect } from "react";
import { useCartActions, useCartInfo } from "../hooks/useCartStore";

export default function Navbar() {
    const { amount, cartItems } = useCartInfo();
    const { calculateTotal } = useCartActions();

    useEffect(() => {
        calculateTotal()
    }, [cartItems, calculateTotal])

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