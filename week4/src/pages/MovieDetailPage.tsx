// src/pages/MovieDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { MovieDetails, Credits, Cast, Crew } from "../types/movie";

const IMG = {
  poster: (p?: string | null) =>
    p ? `https://image.tmdb.org/t/p/w500${p}` : "https://placehold.co/342x513?text=No+Image",
  backdrop: (p?: string | null) =>
    p ? `https://image.tmdb.org/t/p/w1280${p}` : "",
};

function formatMinutes(min?: number | null) {
  if (!min && min !== 0) return "-";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;

    const token = import.meta.env.VITE_TMDB_KEY as string | undefined;
    if (!token) {
      setErr("환경변수 VITE_TMDB_KEY 가 설정되어 있지 않습니다.");
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    };

    const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`;

    setLoading(true);
    setErr(null);

    Promise.all([
      fetch(detailUrl, { headers }),
      fetch(creditsUrl, { headers }),
    ])
      .then(async ([dRes, cRes]) => {
        if (!dRes.ok) throw new Error(`상세 요청 실패 (${dRes.status})`);
        if (!cRes.ok) throw new Error(`크레딧 요청 실패 (${cRes.status})`);
        const dJson = (await dRes.json()) as MovieDetails;
        const cJson = (await cRes.json()) as Credits;
        setDetails(dJson);
        setCredits(cJson);
      })
      .catch((e: unknown) => {
        setErr(e instanceof Error ? e.message : "알 수 없는 에러");
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  const directors = useMemo(
    () => (credits?.crew || []).filter((p: Crew) => p.job === "Director"),
    [credits]
  );

  const topCast = useMemo(
    () => (credits?.cast || []).sort((a: Cast, b: Cast) => a.order - b.order).slice(0, 12),
    [credits]
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-300 border-t-transparent" />
        <p className="text-sm text-gray-500">영화 정보를 불러오는 중…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline"
        >
          ← 뒤로가기
        </button>
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-700">에러</p>
          <p className="text-red-600 text-sm mt-1">{err}</p>
        </div>
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className="min-h-screen">
      {/* 헤더(백드롭) */}
      <div
        className="w-full h-64 md:h-80 bg-cover bg-center relative"
        style={{
          backgroundImage: details.backdrop_path
            ? `url(${IMG.backdrop(details.backdrop_path)})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
      </div>

      {/* 본문 */}
      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={IMG.poster(details.poster_path)}
              alt={details.title}
              className="w-40 md:w-48 lg:w-56 rounded-xl shadow-md mx-auto md:mx-0"
            />

            <div className="flex-1 space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold">
                {details.title}{" "}
                <span className="text-gray-500 text-lg">
                  ({details.release_date?.slice(0, 4) || "—"})
                </span>
              </h1>

              {details.tagline && (
                <p className="italic text-gray-600 dark:text-gray-300">“{details.tagline}”</p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
                <span>평점 ⭐ {details.vote_average.toFixed(1)} / 10</span>
                <span>·</span>
                <span>러닝타임 {formatMinutes(details.runtime)}</span>
                {!!details.genres?.length && (
                  <>
                    <span>·</span>
                    <span>장르 {details.genres.map(g => g.name).join(", ")}</span>
                  </>
                )}
              </div>

              <div>
                <h2 className="font-semibold mt-4 mb-1">줄거리</h2>
                <p className="text-sm leading-6 text-gray-700 dark:text-gray-200">
                  {details.overview || "줄거리 정보가 없습니다."}
                </p>
              </div>

              {!!directors.length && (
                <div className="text-sm">
                  <span className="font-semibold">감독:</span>{" "}
                  {directors.map(d => d.name).join(", ")}
                </div>
              )}

              {details.homepage && (
                <a
                  href={details.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-blue-600 hover:underline text-sm"
                >
                  공식 홈페이지 열기 ↗
                </a>
              )}
            </div>
          </div>

          {/* 출연진 */}
          {!!topCast.length && (
            <div className="mt-8">
              <h3 className="font-semibold mb-3">출연</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {topCast.map((c) => (
                  <div key={c.id} className="min-w-[120px]">
                    <img
                      src={
                        c.profile_path
                          ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                          : "https://placehold.co/185x278?text=No+Image"
                      }
                      alt={c.name}
                      className="w-[120px] h-[170px] object-cover rounded-xl shadow"
                    />
                    <div className="mt-2">
                      <p className="text-sm font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-gray-500 truncate">{c.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 뒤로가기 */}
          <div className="mt-8">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl border shadow-sm hover:shadow transition text-sm"
            >
              ← 뒤로가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
