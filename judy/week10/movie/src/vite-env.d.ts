/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_TMDB_KEY: string;
    readonly VITE_IMAGE_BASE_URL: string;
    readonly VITE_BACKDROP_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
