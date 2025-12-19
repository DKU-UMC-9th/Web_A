import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState, useCallback, useMemo, memo } from "react";
import type { LpItem } from "../types/lps";

interface LpCardProps {
    lp: LpItem;
}

function LpCard({ lp }: LpCardProps) {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    // useCallback으로 클릭 핸들러 메모이제이션
    const handleClick = useCallback(() => {
        navigate(`/lp/${lp.id}`);
    }, [navigate, lp.id]);

    // useCallback으로 이미지 로드 핸들러 메모이제이션
    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    // useMemo로 날짜 포맷팅 결과 캐싱
    const formattedDate = useMemo(() => {
        return new Date(lp.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, [lp.createdAt]);

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
                onLoad={handleImageLoad}
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
                        {formattedDate}
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

// React.memo로 감싸서 props가 변경되지 않으면 리렌더링 방지
export default memo(LpCard);
