import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { increase, decrease, removeItem, clearCart, calculateTotals } from '../features/cart/cartSlice';
import CartItem from './CartItem';
import type { CartItem as CartItemType } from '../constants/cartItems';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const { cartItems, amount, total } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  const handleIncrease = (id: string) => {
    dispatch(increase(id));
  };

  const handleDecrease = (id: string) => {
    dispatch(decrease(id));
  };

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <section className="bg-white shadow rounded p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">Your cart is empty</div>
        ) : (
          <div>
            {cartItems.map((item: CartItemType) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            ))}

            <div className="flex items-center justify-between mt-6">
              <button onClick={handleClear} className="px-4 py-2 border rounded hover:bg-gray-50">
                전체 삭제
              </button>

              <div className="text-right">
                <p className="text-sm text-gray-500">총 수량: <span className="font-semibold">{amount}</span></p>
                <p className="text-lg font-bold">총 금액: <span className="text-indigo-600">${total}</span></p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Cart;
