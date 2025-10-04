import './App.css'
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage'
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// BroswerRouter v5
// createBrowserRouter v6 -> 사용
// react-router-dom v7(next.js, remix)

const router= createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'movies/:category',
        element: <MoviePage />
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage />
      }
    ]
  }
]);

// movies/upcoming
// movies/popluar
// movies/now_playing
// movies/top_rated
// movies/category/{movie_id}

function App() {
  return <RouterProvider router={router} />
}

export default App
