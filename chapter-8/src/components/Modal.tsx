import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart } from '../features/cart/cartSlice';

const Modal: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  if (!isOpen) {
    return null;
  }

  const handleNo = () => {
    dispatch(closeModal());
  };

  const handleYes = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-40"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div className="bg-white rounded-lg p-8 w-80 shadow-2xl">
        <h2 className="text-xl font-bold text-center mb-6">정말 삭제하시겠습니까?</h2>
        <p className="text-gray-600 text-center mb-8">장바구니의 모든 상품이 삭제됩니다.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleNo}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
          >
            아니요
          </button>
          <button
            onClick={handleYes}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
