import React, { useEffect } from "react";

interface AuthGuardModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const AuthGuardModal = ({ open, onConfirm, onCancel }: AuthGuardModalProps) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
        <h2 className="text-xl font-bold mb-2">로그인이 필요합니다</h2>
        <p className="text-gray-600 text-sm mb-6">
          이 페이지는 로그인한 사용자만 접근할 수 있습니다.<br />
          로그인 페이지로 이동하시겠습니까?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthGuardModal;
