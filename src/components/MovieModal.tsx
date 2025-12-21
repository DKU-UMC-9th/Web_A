import { memo } from 'react'

interface Movie {
    id: number
    title: string
    poster_path: string
    release_date: string
    vote_average: number
    overview: string
}

interface MovieModalProps {
    movie: Movie
    onClose: () => void
    onIMDbSearch: (title: string) => void
}

const MovieModal = memo(function MovieModal({
    movie,
    onClose,
    onIMDbSearch,
}: MovieModalProps) {
    console.log('MovieModal rendered')

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                {/* 모달 헤더 */}
                <div className="relative">
                    {movie.poster_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-96 object-cover"
                        />
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center"
                    >
                        ✕
                    </button>
                </div>

                {/* 모달 본문 */}
                <div className="p-6">
                    <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">평점</p>
                            <p className="text-2xl font-bold text-yellow-500">
                                ⭐ {movie.vote_average.toFixed(1)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">개봉일</p>
                            <p className="text-lg font-semibold">{movie.release_date}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">줄거리</p>
                            <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
                        </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => onIMDbSearch(movie.title)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-200"
                        >
                            IMDb에서 검색하기
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg transition duration-200"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default MovieModal
