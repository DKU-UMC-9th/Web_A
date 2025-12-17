import { useCartStore } from '../../store/useCartStore';

const Modal = () => {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { isModalOpen, closeModal, clearCart } = useCartStore();

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isModalOpen) return null;

  const handleNo = () => {
    // "아니요" 버튼 클릭 시 모달만 닫기
    closeModal();
  };

  const handleYes = () => {
    // "네" 버튼 클릭 시 장바구니 삭제 + 모달 닫기
    clearCart();
    closeModal();
  };

  return (
    <>
      {/* 배경 */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
        onClick={handleNo}
      />

      {/* 모달 창 */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          {/* 모달 제목 */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            장바구니 전체 삭제
          </h2>

          {/* 모달 메시지 */}
          <p className="text-gray-600 mb-8 text-center">
            장바구니의 모든 상품을 삭제하시겠습니까?
            <br />
            이 작업은 되돌릴 수 없습니다.
          </p>

          {/* 버튼 그룹 */}
          <div className="flex gap-4">
            {/* 아니요 버튼 */}
            <button
              onClick={handleNo}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              아니요
            </button>

            {/* 네 버튼 */}
            <button
              onClick={handleYes}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              네
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
