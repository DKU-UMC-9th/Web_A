import { useMemo, useState, useCallback } from "react";
import axios from "axios";
import type { MovieResponse, Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MoviePage() {
  // 기존 상태 그대로
  const [page, setPage] = useState(1);
  const { category = "popular" } = useParams<{ category: string }>();

  //  fetcher를 useCallback으로 "안정화"
  const fetchMovies = useCallback(async (): Promise<MovieResponse> => {
    const token = import.meta.env.VITE_TMDB_KEY as string;
    if (!token) throw new Error("VITE_TMDB_KEY 가 설정되어 있지 않습니다.");
    const { data } = await axios.get<MovieResponse>(
      `https://api.themoviedb.org/3/movie/${category}`,
      {
        params: { language: "ko-KR", page },
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      }
    );
    return data;
  }, [category, page]);

  const depsKey = useMemo(() => JSON.stringify({ category, page }), [category, page]);

  const { data, loading, error, refetch } = useCustomFetch<MovieResponse>(fetchMovies, {
    depsKey,
    immediate: true,
  });

  const movies: Movie[] = data?.results ?? [];
  const isPending = loading;
  const isError = !!error;

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다. </span>
        <button onClick={refetch} className="ml-3 rounded-md border px-3 py-1 text-sm hover:bg-gray-50">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 기존 페이지네이션 UI 그대로 */}
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {`<`}
        </button>
        <span>{page} 페이지</span>
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
        >
          {`>`}
        </button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 mg:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
