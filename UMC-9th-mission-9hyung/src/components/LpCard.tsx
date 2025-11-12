import { Link } from "react-router-dom";
import type { LpItem } from "../types/lp";

interface LpCardProps {
  lp: LpItem;
}

const LpCard = ({ lp }: LpCardProps) => {
  console.log("LpCard data:", lp);
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  return (
    <Link
      to={`/lps/${lp.id}`}
      className="relative block aspect-square overflow-hidden rounded-md shadow-md group
             transform transition-transform duration-300 ease-in-out
             hover:scale-[1.08]"
    >
      {/* 이미지 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
      />

      {/* 오버레이 */}
      <div
        className="absolute inset-0 z-10 pointer-events-none
               bg-black/0 group-hover:bg-black/60
               transition-colors duration-300 ease-in-out"
      />

      {/* 텍스트 */}
      <div
        className="absolute inset-0 z-20 p-4 flex flex-col justify-end text-white
               opacity-0 group-hover:opacity-100
               transition-opacity duration-300 ease-in-out"
      >
        <h3 className="font-bold text-lg truncate">{lp.title}</h3>
        <div className="flex justify-between items-center text-sm mt-2">
          <span>{timeAgo(lp.createdAt)}</span>
          <span>♥ {lp.likes?.length || 0}</span>
        </div>
      </div>
    </Link>
  );
};

export default LpCard;
