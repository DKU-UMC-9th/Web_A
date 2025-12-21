import React from 'react';
import { usePlaylistStore } from '../store/playlistStore';

const Modal: React.FC = () => {
  const isModalOpen = usePlaylistStore((state) => state.isModalOpen);
  const closeModal = usePlaylistStore((state) => state.closeModal);
  const clearCart = usePlaylistStore((state) => state.clearCart);

  if (!isModalOpen) {
    return null;
  }

  const handleNo = () => {
    closeModal();
  };

  const handleYes = () => {
    clearCart();
    closeModal();
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
