import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { getMyInfo, patchMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 사용자 정보 불러오기
  useEffect(() => {
    if (!accessToken) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await getMyInfo();
        if (response.data) {
          setName(response.data.name);
          setBio(response.data.bio || "");
          setSelectedImage(response.data.avatar);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [accessToken, navigate]);

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

  // 프로필 수정 mutation
  const updateMyInfoMutation = useMutation({
    mutationFn: patchMyInfo,
    onSuccess: () => {
      alert('프로필이 수정되었습니다.');
      navigate('/');
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      alert('프로필 수정에 실패했습니다. 다시 시도해주세요.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateMyInfoMutation.mutate({
        name: name.trim(),
        bio: bio.trim() || undefined,
        avatar: selectedImage || undefined
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-8 text-center">마이페이지</h1>

        {/* 프로필 이미지 섹션 */}
        <div className="flex justify-center mb-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={handleImageClick}
            className="w-40 h-40 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-gray-700 flex items-center justify-center border-4 border-pink-500"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-20 h-20 text-gray-400" />
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mb-8">
          프로필 사진을 클릭하여 변경하세요
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-8 rounded-2xl">
          {/* 이름 */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-300 mb-3">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-lg font-medium text-gray-300 mb-3">
              Bio (선택)
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              placeholder="자기소개를 입력하세요"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={updateMyInfoMutation.isPending}
              className="w-full px-6 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors font-semibold text-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {updateMyInfoMutation.isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
