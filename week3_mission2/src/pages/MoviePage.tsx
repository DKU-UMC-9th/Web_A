import { useEffect, useState } from "react";
import axios from "axios";
import type { MovieResponse, Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
        //1.로딩 상태
    const [isPending, setIsPending] = useState(false);
    //2.에러 상태
    const [isError, setIsError] = useState(false);
    //3.페이지
    const [page, setPage] = useState(1);

    
    const {category} = useParams<{
        category : string;
    }>();


 

  useEffect(() => {
        const fetchMovies = async () => {
        setIsPending(true);

      try{
        const {data} = await axios.get<MovieResponse>(
        `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
        
        {
            headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZTU0YjI5MmY4YzQ5ZDc5NzdkNWU3MTkzYzAyZTg3NCIsIm5iZiI6MTc1OTYwMjIxOC4zMDgsInN1YiI6IjY4ZTE2NjJhZDFhNzRhNTkwYmY4MTFiOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gBM8AGoWNUks99jpM2z6MyoGjPps2CP4TsuTPs8rX70`,
        },
    }
      ); 

        setMovies(data.results);
      } catch{
        setIsError(true);
      } finally {
        setIsPen