// src/utils/tmdb.ts
const TMDB_BASE = "https://api.themoviedb.org/3";

export const tmdbHeaders = () => {
  const token = import.meta.env.VITE_TMDB_KEY as string;
  if (!token) throw new Error("TMDB token missing: VITE_TMDB_KEY");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

export const tmdbUrl = (path: string, params?: Record<string, string | number | boolean>) => {
  const url = new URL(`${TMDB_BASE}${path}`);
  // 한글 선호라면 ko-KR 기본
  url.searchParams.set("language", "ko-KR");
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  return url.toString();
};
