import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import type { MovieDetails, Credits } from "../types/movie"
import { LoadingSpinner } from "../components/LoadingSpinner"

export default function MovieDetailPage () : React.ReactElement {
    const { movieId } = useParams<{ movieId: string }>();

    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [credits, setCredits] = useState<Credits | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() : void => {
        const fetchMovieData = async () : Promise<void> => {
            if (!movieId) return;

            setIsPending(true);
            setIsError(false);

            try {
                const [detailsResponse, creditsResponse] = await Promise.all([
                    axios.get<MovieDetails>(
                        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                        {
                            headers: {
                                'Authorization': `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    ),
                    axios.get<Credits>(
                        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                        {
                            headers: {
                                'Authorization': `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                ]);

                setMovieDetails(detailsResponse.data);
                setCredits(creditsResponse.data);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovieData();
    }, [movieId]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <span className="text-red-500 text-2xl">영화 정보를 불러오는 중 에러가 발생했습니다.</span>
            </div>
        );
    }

    if (!movieDetails) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner />
            </div>
        );
    }

    const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
    const backdropBaseUrl = import.meta.env.VITE_BACKDROP_BASE_URL;
    const backdropUrl = movieDetails.backdrop_path
        ? `${backdropBaseUrl}${movieDetails.backdrop_path}`
        : '';

    return (
        <div className="min-h-screen bg-black text-white">
            {/* 배경 이미지 섹션 */}
            <div className="relative h-[500px] w-full">
                {backdropUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${backdropUrl})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                    </div>
                )}

                {/* 영화 정보 오버레이 */}
                <div className="relative z-10 h-full flex items-end">
                    <div className="container mx-auto px-8 pb-12">
                        <div className="flex gap-8 items-end">
                            {/* 포스터 */}
                            {movieDetails.poster_path && (
                                <img
                                    src={`${imageBaseUrl}${movieDetails.poster_path}`}
                                    alt={movieDetails.title}
                                    className="w-64 rounded-lg shadow-2xl"
                                />
                            )}

                            {/* 기본 정보 */}
                            <div className="flex-1 mb-4">
                                <h1 className="text-5xl font-bold mb-2">{movieDetails.title}</h1>
                                {movieDetails.tagline && (
                                    <p className="text-xl text-gray-300 italic mb-4">{movieDetails.tagline}</p>
                                )}

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-400 text-2xl">★</span>
                                        <span className="text-2xl font-semibold">{movieDetails.vote_average.toFixed(1)}</span>
                                        <span className="text-gray-400">({movieDetails.vote_count.toLocaleString()} 투표)</span>
                                    </div>
                                    <span className="text-gray-400">|</span>
                                    <span>{movieDetails.release_date}</span>
                                    <span className="text-gray-400">|</span>
                                    <span>{movieDetails.runtime}분</span>
                                </div>

                                {/* 장르 */}
                                <div className="flex gap-2 flex-wrap">
                                    {movieDetails.genres.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="px-4 py-1 bg-[#dda5e3]/30 rounded-full text-sm border border-[#dda5e3]"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 상세 정보 섹션 */}
            <div className="container mx-auto px-8 py-12">
                {/* 줄거리 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">줄거리</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        {movieDetails.overview || '줄거리 정보가 없습니다.'}
                    </p>
                </section>

                {/* 추가 정보 */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-gray-900 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">영화 정보</h3>
                        <div className="space-y-2 text-gray-300">
                            <p><span className="text-white font-semibold">원제:</span> {movieDetails.original_title}</p>
                            <p><span className="text-white font-semibold">상태:</span> {movieDetails.status}</p>
                            <p><span className="text-white font-semibold">원어:</span> {movieDetails.original_language.toUpperCase()}</p>
                            {movieDetails.budget > 0 && (
                                <p><span className="text-white font-semibold">제작비:</span> ${movieDetails.budget.toLocaleString()}</p>
                            )}
                            {movieDetails.revenue > 0 && (
                                <p><span className="text-white font-semibold">수익:</span> ${movieDetails.revenue.toLocaleString()}</p>
                            )}
                        </div>
                    </div>

                    {movieDetails.production_companies.length > 0 && (
                        <div className="bg-gray-900 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3">제작사</h3>
                            <div className="space-y-2 text-gray-300">
                                {movieDetails.production_companies.map((company) => (
                                    <p key={company.id}>{company.name}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* 출연진 섹션 */}
                {credits && credits.cast.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">출연진</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {credits.cast.slice(0, 12).map((person) => (
                                <div key={person.credit_id} className="text-center">
                                    <div className="mb-2">
                                        {person.profile_path ? (
                                            <img
                                                src={`${imageBaseUrl}${person.profile_path}`}
                                                alt={person.name}
                                                className="w-full aspect-[2/3] object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-500 text-4xl">👤</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold text-sm mb-1">{person.name}</p>
                                    <p className="text-gray-400 text-xs">{person.character}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 제작진 섹션 */}
                {credits && credits.crew.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">제작진</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {credits.crew
                                .filter((person) =>
                                    person.job === 'Director' ||
                                    person.job === 'Producer' ||
                                    person.job === 'Writer' ||
                                    person.job === 'Screenplay'
                                )
                                .slice(0, 12)
                                .map((person) => (
                                    <div key={person.credit_id} className="text-center">
                                        <div className="mb-2">
                                            {person.profile_path ? (
                                                <img
                                                    src={`${imageBaseUrl}${person.profile_path}`}
                                                    alt={person.name}
                                                    className="w-full aspect-[2/3] object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center">
                                                    <span className="text-gray-500 text-4xl">👤</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="font-semibold text-sm mb-1">{person.name}</p>
                                        <p className="text-gray-400 text-xs">{person.job}</p>
                                    </div>
                                ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}