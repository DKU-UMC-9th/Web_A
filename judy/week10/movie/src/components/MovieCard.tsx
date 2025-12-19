import { useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";

interface MovieCardProps {
    movie: Movie;
}

function MovieCard({ movie } : MovieCardProps): React.ReactElement {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    // useCallback으로 함수 메모이제이션
    const handleCardClick = useCallback(() => {
        navigate(`/movies/${movie.id}`);
    }, [navigate, movie.id]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    return(
        <div
            onClick={handleCardClick}
            className="relative cursor-pointer rounded-xl shadow-lg overflow-hidden w-44 transition-transform duartion-500 hover:scale-105"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
         alt={`${movie.title} 영화의 이미지`}
         className=""
        />

            {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to transparent
                backdrop-blur-md flex flex-col justify-center itmes-center text-white p-4">
                    <h2 className="text-lg font-bold text-center leading-snug">{movie.title}</h2>
                    <p className="text-sm text-gray-300 leading-snug mt-2 line-clamp-5">{movie.overview}</p>
                </div>
            )}
        </div>
    )
}

// memo로 감싸서 props가 변경되지 않으면 리렌더링 방지
export default memo(MovieCard);