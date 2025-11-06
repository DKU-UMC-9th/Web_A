import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { LpItem } from "../types/lps";

interface LpCardProps {
    lp: LpItem;
}

export default function LpCard({ lp }: LpCardProps) {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleClick = () => {
        navigate(`/lp/${lp.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
        >
            {/* 스켈레톤 로딩 (이미지 로드 전) */}
            {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
                </div>
            )}

            {/* LP 이미지 */}
            <img
                src={lp.thumbnail}
                alt={lp.title}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {/* 호버 시 오버레이 배경 */}
            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 pointer-events-none"></div>

            {/* 호버 시 텍스트 정보 */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="text-white">
                    {/* 제목 */}
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                        {lp.title}
                    </h3>

                    {/* 업로드일 */}
                    <p className="text-sm text-gray-300 mb-2">
                        {new Date(lp.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>

                    {/* 좋아요 */}
                    <div className="flex items-center gap-2 text-pink-400">
                        <Heart className="w-5 h-5 fill-current" />
                        <span className="text-sm font-medium">
                            {lp.likes?.length || 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
