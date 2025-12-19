import { memo, useCallback, useMemo } from "react";
import type { Movie } from "../types/movie";

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

function MovieModal({ movie, onClose }: MovieModalProps): React.ReactElement {
    // 모달 배경 클릭 시 닫기 (useCallback으로 메모이제이션)
    const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    // IMDb 검색 URL (useMemo로 메모이제이션)
    const imdbSearchUrl = useMemo(
        () => `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`,
        [movie.title]
    );

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                {/* 포스터 이미지 */}
                <div className="relative">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-64 object-cover rounded-t-xl"
                    />
                    {/* 닫기 버튼 (상단 우측) */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                        aria-label="닫기"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* 영화 정보 */}
                <div className="p-6 space-y-4">
                    {/* 제목 */}
                    <h2 className="text-3xl font-bold text-white">{movie.title}</h2>

                    {/* 원제 */}
                    {movie.original_title !== movie.title && (
                        <p className="text-gray-400 text-sm">{movie.original_title}</p>
                    )}

                    {/* 평점, 개봉일 */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <svg
                                className="w-5 h-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-white font-semibold">
                                {movie.vote_average.toFixed(1)}
                            </span>
                            <span className="text-gray-400">
                                ({movie.vote_count} votes)
                            </span>
                        </div>

                        <div className="text-gray-400">
                            <span className="font-medium">개봉일:</span> {movie.release_date}
                        </div>
                    </div>

                    {/* 언어 */}
                    <div className="text-sm text-gray-400">
                        <span className="font-medium">언어:</span> {movie.original_language.toUpperCase()}
                    </div>

                    {/* 인기도 */}
                    <div className="text-sm text-gray-400">
                        <span className="font-medium">인기도:</span> {movie.popularity.toFixed(0)}
                    </div>

                    {/* 성인 콘텐츠 여부 */}
                    {movie.adult && (
                        <div className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                            성인 콘텐츠
                        </div>
                    )}

                    {/* 줄거리 */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">줄거리</h3>
                        <p className="text-gray-300 leading-relaxed">
                            {movie.overview || "줄거리 정보가 없습니다."}
                        </p>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex gap-3 pt-4">
                        {/* IMDb 검색 버튼 */}
                        <a
                            href={imdbSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 text-center shadow-lg hover:shadow-xl"
                        >
                            IMDb에서 검색하기
                        </a>

                        {/* 닫기 버튼 */}
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// memo로 감싸서 props가 변경되지 않으면 리렌더링 방지
export default memo(MovieModal);
