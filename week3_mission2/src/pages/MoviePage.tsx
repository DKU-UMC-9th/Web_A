import { useEffect, useState } from "react";
import axios from "axios";
import type { MovieResponse, Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";

export default function MoviePage() {
        const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const {data} = await axios.get<MovieResponse>(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`,
        {
            headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZTU0YjI5MmY4YzQ5ZDc5NzdkNWU3MTkzYzAyZTg3NCIsIm5iZiI6MTc1OTYwMjIxOC4zMDgsInN1YiI6IjY4ZTE2NjJhZDFhNzRhNTkwYmY4MTFiOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gBM8AGoWNUks99jpM2z6MyoGjPps2CP4TsuTPs8rX70`,
        },
    }
      ); 

        setMovies(data.results);
    };
    fetchMovies();
  }, []);



  return <div className= 'p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 mg:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'> 
    {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
  </div>;
}
