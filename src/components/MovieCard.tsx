import { memo } from 'react'

interface Movie {
    id: number
    title: string
    poster_path: string
    release_date: string
    vote_average: number
    overview: string
}

interface MovieCardProps {
    movie: Movie
    onSelect: (movie: Movie) => void
}

const MovieCard = memo(function MovieCard({ movie, onSelect }: MovieCardProps) {
    console.log(`MovieCard rendered: ${movie.title}`)

    return (
        <div
            onClick={() => onSelect(movie)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-200"
        >
            {movie.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    loading="lazy"
                    className="w-full h-64 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="font-bold text-sm truncate">{movie.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{movie.release_date}</p>
                <p className="text-xs font-semibold text-yellow-500 mt-2">
                    ⭐ {movie.vote_average.toFixed(1)}
                </p>
            </div>
        </div>
    )
})

export default MovieCard
