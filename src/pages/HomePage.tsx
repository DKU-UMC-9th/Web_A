import { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import axiosClient from '../apis/axiosClient'
import SearchForm from '../components/SearchForm'
import MovieCard from '../components/MovieCard'

// Lazy load the modal
const MovieModal = lazy(() => import('../components/MovieModal'))

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
  overview: string
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [includeAdult, setIncludeAdult] = useState(false)
  const [language, setLanguage] = useState('ko-KR')
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 페이지 로드 시 인기 영화 불러오기
  useEffect(() => {
    loadPopularMovies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadPopularMovies = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('인기 영화 로드 중...')
      const response = await axiosClient.get('/movie/popular', {
        params: {
          language: language,
        },
      })
      console.log('API 응답:', response.data)
      setMovies(response.data.results || [])
    } catch (error) {
      console.error('영화 로드 오류:', error)
      setError('영화를 불러오는 중에 오류가 발생했습니다.')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')
    try {
      console.log('검색 시작:', searchQuery)
      const response = await axiosClient.get('/search/movie', {
        params: {
          query: searchQuery,
          include_adult: includeAdult,
          language: language,
        },
      })
      console.log('API 응답:', response.data)
      setMovies(response.data.results || [])
    } catch (error) {
      console.error('영화 검색 오류:', error)
      setError('영화를 검색하는 중에 오류가 발생했습니다.')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  // useCallback to prevent SearchForm re-renders
  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      performSearch(query)
    },
    [query, includeAdult, language]
  )

  // useCallback to prevent MovieModal re-renders
  const handleIMDbSearch = useCallback((movieTitle: string) => {
    const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movieTitle)}`
    window.open(imdbUrl, '_blank')
  }, [])

  // useCallback to prevent MovieModal re-renders
  const closeModal = useCallback(() => {
    setSelectedMovie(null)
  }, [])

  // useCallback to prevent MovieCard re-renders
  const onMovieSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 검색 영역 */}
      <SearchForm
        query={query}
        setQuery={setQuery}
        includeAdult={includeAdult}
        setIncludeAdult={setIncludeAdult}
        language={language}
        setLanguage={setLanguage}
        onSubmit={handleSearch}
      />

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">검색 중...</p>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* 영화 목록 */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {movies.length === 0 && !loading && query && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">검색 결과가 없습니다.</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelect={onMovieSelect} />
          ))}
        </div>
      </div>

      {/* 모달 */}
      <Suspense fallback={null}>
        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={closeModal}
            onIMDbSearch={handleIMDbSearch}
          />
        )}
      </Suspense>
    </div>
  )
}