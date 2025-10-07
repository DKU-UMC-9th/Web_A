/// <reference types="vite/client" />
interface ImportMeaaEnv {
    readonly VITE_TMDB_KEY: string;
}

interface ImportMeta {
    readonly env: VITE_TMDB_KEY;
}