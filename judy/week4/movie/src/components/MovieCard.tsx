import { useState } from "react";
import type { Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie } : MovieCardProps): React.ReactElement {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    return(
        <div  onClick={() => navigate(`/movie/${movie.id}`)}
              className="relative cursor-pointer rounded-xl shadow-lg overflow-hidden w-44 transition-transform duartion-500 hover:scale-105"
              onMouseEnter={() : void => setIsHovered(true)}
              onMouseLeave={() : void => setIsHovered(false)}
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