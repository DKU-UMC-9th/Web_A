import { useState } from "react";
import type { User } from "../types/user";
import usePatchUserInfo from "../hooks/mutations/usePatchUesrInfo";

export default function EditProfileModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatar, setAvatar] = useState(user.avatar ?? "");

  const { mutate, isPending } = usePatchUserInfo();

  const handleSave = () => {
    mutate(
      { name, bio: bio || null, avatar: avatar || null },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-xl w-96 text-white relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-xl cursor-pointer"
        >
          ✕
        </button>

        <div className="flex flex-col items-center mb-6">
          <img
            src={avatar || "/default_profile.png"}
            className="w-28 h-28 rounded-full bg-gray-700 object-cover mb-3"
          />

          <input
            type="text"
            placeholder="프로필 이미지 URL"
            className="w-full p-2 bg-gray-800 rounded-md mb-3"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </div>

        <input
          className="w-full p-2 mb-3 bg-gray-800 rounded-md outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
        />

        <input
          className="w-full p-2 mb-3 bg-gray-800 rounded-md outline-none"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="소개글 (선택)"
        />

        <button
          onClick={handleSave}
          disabled={isPending}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-md mt-2 cursor-pointer"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
