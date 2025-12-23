import type { Movie } from "../types/movie";

interface MovieCardProps {
    movie: Movie;
    onClick: () => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
    const fallbackImage = "https://via.placeholder.com/640x480";


    return (
        <div className=" cursor-pointer overflow-hidden rounded-lg bg-white shadow-md
            transition-all hover:shadow-lg" onClick={onClick}>
            <div className="relative h-80 overflow-hidden">
                <img
                    src={
                        movie.poster_path
                            ? `${imageBaseUrl}${movie.poster_path}`
                            : fallbackImage
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover object-cover transition-transform hover:scale-110
                    ease-in-out duration-300"
                />
                <div className="absolute top-2 right-2 rounded-md bg-black px-2 py-1
                text-sm font-bold text-white">
                    {movie.vote_average.toFixed(1)}
                </div>
            </div>
            <div className="p-4">
                <h2 className="font-bold text-center">{movie.title}</h2>
                <p className="text-sm text-black-600 text-center mb-2">{movie.release_date}</p>
                <p className="text-sm text-gray-600 text-center">{movie.overview.slice(0, 100) + "..."}</p>
            </div>
        </div>
    )
}

export default MovieCard;