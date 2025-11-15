import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; bio?: string; avatar?: string }) => void;
  currentUserInfo: {
    name: string;
    bio: string | null;
    avatar: string | null;
  };
}

export default function MyPageModal({ isOpen, onClose, onSubmit, currentUserInfo }: MyPageModalProps) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때 현재 사용자 정보로 초기화
  useEffect(() => {
    if (isOpen && currentUserInfo) {
      setName(currentUserInfo.name);
      setBio(currentUserInfo.bio || "");
      setSelectedImage(currentUserInfo.avatar);
    }
  }, [isOpen, currentUserInfo]);

  if (!isOpen) return null;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        bio: bio.trim() || undefined,
        avatar: selectedImage || undefined
      });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 relative">
        {/* X Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 제목 */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">마이페이지</h2>

        {/* 프로필 이미지 섹션 */}
        <div className="flex justify-center mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={handleImageClick}
            className="w-32 h-32 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-gray-700 flex items-center justify-center"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
              Bio (선택)
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              placeholder="자기소개를 입력하세요"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors font-semibold text-lg"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
