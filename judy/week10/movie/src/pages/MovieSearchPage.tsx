import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom";
import type { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

export default function MovieSearchPage(): React.ReactElement {
    const [searchParams] = useSearchParams();

    // URL에서 파라미터 가져오기
    const searchQuery = searchParams.get('q') || "";
    const includeAdult = searchParams.get('include_adult') === 'true';
    const language = searchParams.get('language') || 'ko-KR';

    // API 응답 데이터 상태
    const [data, setData] = useState<MovieResponse | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // URL 파라미터가 변경되면 자동으로 검색 실행
    useEffect(() => {
        const fetchMovies = async (): Promise<void> => {
            if (!searchQuery.trim()) {
                setData(null);
                return;
            }

            setIsPending(true);
            setIsError(false);
            setError(null);

            try {
                // TMDB API 검색 파라미터 설정
                const params = new URLSearchParams({
                    query: searchQuery.trim(),
                    include_adult: includeAdult.toString(), // 성인 콘텐츠 포함 여부
                    language: language, // 선택한 언어
                    page: "1",
                });

                const response = await fetch(
                    `https://api.themoviedb.org/3/search/movie?${params}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('영화 검색에 실패했습니다.');
                }

                const result: MovieResponse = await response.json();
                setData(result);
            } catch (err) {
                setIsError(true);
                setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
            } finally {
                setIsPending(false);
            }
        };

        fetchMovies();
    }, [searchQuery, includeAdult, language]);

    if (isError) {
        return <ErrorMessage message={error || '영화 검색 중 에러가 발생했습니다.'} />;
    }

    return (
        <div className="min-h-screen p-6">
            {/* 검색 결과 영역 */}
            <div className="max-w-7xl mx-auto">
                {isPending && (
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner />
                    </div>
                )}

                {!isPending && searchQuery && data && (
                    <>
                        <div className="mb-6 text-center">
                            <p className="text-xl font-semibold">
                                "{searchQuery}" 검색 결과: <span className="text-pink-300">{data.total_results}</span>개의 영화
                            </p>
                        </div>

                        {data.results.length > 0 ? (
                            <div className="p-10 grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-items-center">
                                {data.results.map((movie): React.ReactElement => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-xl text-gray-300">검색 결과가 없습니다.</div>
                            </div>
                        )}
                    </>
                )}

                {!searchQuery && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-xl text-gray-300">상단 검색창에서 영화 제목을 검색하세요.</div>
                    </div>
                )}
            </div>
        </div>
    );
}
