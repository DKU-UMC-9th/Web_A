import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createPortal } from "react-dom";

interface ConfirmDeleteModalProps {
  open: boolean;
  message?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDeleteModal = ({
  open,
  message,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) => {
  // 모달 열릴 때 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    open ? (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* 배경 오버레이 */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* 모달 박스 */}
        <div className="relative bg-[#2a2a2a] text-white p-20 rounded-xl shadow-2xl z-[10000] w-[550px] text-center">
          {/* 닫기 버튼 */}
          <button
            className="absolute top-4 right-4 text-gray-300 hover:text-white cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>

          <p className="text-2xl font-semibold mb-15">{message}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onConfirm}
              className="px-5 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              예
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
            >
              아니요
            </button>
          </div>
        </div>
      </div>
    ) : null,
    document.body,
  );
};

export default ConfirmDeleteModal;
