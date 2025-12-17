import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { calculateTotals } from '../../features/cart/cartSlice';
import { openModal } from '../../features/modal/modalSlice';
import CartItem from './CartItem';
import Modal from '../modal/Modal';
import { ShoppingCart } from 'lucide-react';

const Cart = () => {
  const dispatch = useAppDispatch();
  const { cartItems, amount, total } = useAppSelector((state) => state.cart);

  // cartItems가 변경될 때마다 totals 재계산
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  const handleClearCart = () => {
    // window.confirm 대신 Redux 모달 열기
    dispatch(openModal());
  };

  return (
    <>
      {/* 모달 컴포넌트 */}
      <Modal />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">당신의 장바구니</h1>
          </div>
          <p className="text-gray-600">음반을 구매해보세요!</p>
        </div>

        {/* 장바구니가 비어있을 때 */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <>
            {/* 장바구니 아이템 목록 */}
            <div className="mb-6">
              {cartItems.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </div>

            {/* 구분선 */}
            <hr className="my-6 border-t-2 border-gray-300" />

            {/* 합계 정보 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700">
                  전체 수량
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {amount}개
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">
                  총 금액
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ₩{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 전체 삭제 버튼 */}
            <div className="text-center">
              <button
                onClick={handleClearCart}
                className="px-8 py-3 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
              >
                전체 삭제
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </>
  );
};

export default Cart;
