import type { Movie } from "../types/movie";

interface MovieModalProps {
    isOpen: boolean;
    movie: Movie | null;
    onClose: () => void;
}

const MovieModal = ({ isOpen, movie, onClose }: MovieModalProps) => {
    if (!isOpen || !movie) return null;

    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
    const fallbackImage = "https://via.placeholder.com/640x480";

    return (
        // 1. 배경 (딤 처리)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}>

            {/* 2. 모달 컨텐츠 박스 */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}>

                {/* 3. 상단 이미지 (포스터 활용) */}
                <div className="relative h-96 w-full">
                    <img
                        src={movie.backdrop_path ? `${imageBaseUrl}${movie.backdrop_path}` : fallbackImage}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* 영화 제목 및 평점 (이미지 위에 겹치게) */}
                    <div className="absolute bottom-6 left-6 text-white">
                        <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
                        <p className="text-lg opacity-80">{movie.original_title}</p>
                    </div>

                    <div className="absolute top-4 right-14 bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                        {movie.vote_average.toFixed(1)}
                    </div>
                </div>

                {/* 4. 상세 내용 */}
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between text-gray-600 text-sm">
                        <div>
                            <span className="font-bold mr-2">개봉일</span> {movie.release_date}
                        </div>
                        <div>
                            <span className="font-bold mr-2">인기도</span> {movie.popularity}
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                        <h3 className="text-lg font-bold mb-2">줄거리</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {movie.overview || "줄거리 정보가 없습니다."}
                        </p>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <a
                            href={`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            IMDb에서 검색
                        </a>
                        <button
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieModal;