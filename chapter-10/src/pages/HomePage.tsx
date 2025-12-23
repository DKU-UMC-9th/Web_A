import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import useFetch from "../hooks/useFetch"
import type { Movie, MovieFilters, MovieResponse } from "../types/movie";
import MovieModal from "../components/MovieModal";

export default function HomePage() {
    const [filters, setFilters] = useState<MovieFilters>({
        query: "코난",
        include_adult: false,
        language: "ko-KR"
    })

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const axiosRequestConfig = useMemo(() => ({
        params: filters,
    }), [filters])

    const { data, error, isLoading } = useFetch<MovieResponse>("/search/movie", axiosRequestConfig);

    const handleMovieFilters = useCallback((filters: MovieFilters) => {
        setFilters(filters);
    }, [setFilters])

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovie(movie);
    }

    const handleCloseModal = () => {
        setSelectedMovie(null);
    }



    console.log('isLoading:', isLoading);
    console.log('error:', error);
    console.log('data:', data);

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>에러 발생: {error}</div>;
    if (!data) return <div>데이터가 없습니다.</div>;

    return (
        <div className="container mx-auto px-20">
            <MovieFilter onChange={handleMovieFilters} />
            {isLoading ? (
                <div>로딩 중...</div>
            ) : (
                <MovieList movies={data.results || []} onClick={handleMovieClick} />
            )}

            <MovieModal
                isOpen={!!selectedMovie}
                movie={selectedMovie}
                onClose={handleCloseModal}
            />
        </div>
    )
}