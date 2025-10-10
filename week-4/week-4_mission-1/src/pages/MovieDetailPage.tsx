import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { type MovieDetail, type Credits } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useCustomFetch } from '../hooks/useCustomFetch';

const MovieDetailPage = () => {
    // const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
    // const [credits, setCredits] = useState<Credits | null>(null);
    // const [isPending, setIsPending] = useState(true);
    // const [isError, setIsError] = useState(false);

    // useEffect(() => {
    //     if (!movieId) return;

    //     const fetchMovieData = async () => {
    //         setIsPending(true);
    //         setIsError(false);

    //         const options = {
    //             headers: {
    //                 Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    //             }
    //         }
    //         const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
    //         const creditUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`;

    //         try {
    //             const [detailResponse, creditResponse] = await Promise.all([
    //                 axios.get<MovieDetail>(detailUrl, options),
    //                 axios.get<Credits>(creditUrl, options),
    //             ]);

    //             setMovieDetail(detailResponse.data);
    //             setCredits(creditResponse.data);
    //         } catch (error) {
    //             setIsError(true);
    //         } finally {
    //             setIsPending(false);
    //         }
    //     }
    //     fetchMovieData();
    // }, [movieId]);
    
    const { movieId } = useParams<{ movieId: string }>();
    const plotRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
    const creditUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`;

    const { data: movieDetail, isPending: isDetailPending, isError: isDetailError } = useCustomFetch<MovieDetail>(detailUrl);
    const { data: credits, isPending: isCreditsPending, isError: isCreditsError } = useCustomFetch<Credits>(creditUrl);

    const isPending = isDetailPending || isCreditsPending;
    const isError = isDetailError || isCreditsError;

    const handleScrollToPlot = () => {
        plotRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            setCanScrollRight(container.scrollLeft < maxScrollLeft - 1);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScroll();
            container.addEventListener('scroll', checkScroll);
        }
        return () => {
            container?.removeEventListener('scroll', checkScroll);
        };
    }, [credits]);

    const handleScroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (isPending) {
        return (
            <div className='flex items-center justify-center h-dvh'>
                <LoadingSpinner />
            </div>
        )
    }

    if (isError) {
        return (
            <div>
                <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
            </div>
        )
    }

    if (!movieDetail || !credits) return <div>데이터를 찾을 수 없습니다.</div>;

    return (
        // 전체를 감싸는 컨테이너
        <div className="bg-[#18171c] text-white min-h-screen">
            {/* --- 상단 영화 정보 섹션 --- */}
            <div
                className="relative h-[80vh] bg-cover bg-center"
                style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetail.backdrop_path})`,
                }}
            >
                {/* 검정색 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#18171c] via-[#18171c]/50 to-transparent"></div>
                {/* 텍스트 콘텐츠 */}
                <div className="relative z-10 flex h-full items-center p-10 md:p-20">
                    <div className="max-w-160 space-y-4">
                        <h1 className="text-5xl md:text-5xl font-extrabold break-all">{movieDetail.title}</h1>

                        
                        <div className="flex items-center space-x-3 text-md text-gray-400 mt-4">
                            {/* 개봉일 */}
                            {movieDetail.release_date && <span>{movieDetail.release_date} 개봉</span>}

                            {/* 구분선 */}
                            <span>|</span>

                            {/* 러닝타임 */}
                            {movieDetail.runtime && <span>{movieDetail.runtime}분</span>}

                            {/* 구분선 */}
                            <span>|</span>

                            {/* 관람 등급 */}
                            <span>{movieDetail.adult ? '19세 이상 관람가' : '전체 이용가'}</span>
                        </div>

                        {/* 태그라인이 있을 때만 표시 */}
                        {movieDetail.tagline && (
                            <p className="text-xl md:text-2xl italic text-gray-300">
                                "{movieDetail.tagline}"
                            </p>
                        )}

                        <div className="relative">
                            <p className="text-base md:text-lg leading-relaxed text-gray-200 line-clamp-2">
                                {movieDetail.overview}
                            </p>
                            <button onClick={handleScrollToPlot}
                                className="absolute bottom-(-10) right-0 hover:underline text-md font-semibold italic cursor-pointer
                            ">
                                더 보기
                            </button>
                        </div>
                        <div className="mt-8 text-sm text-gray-300">
                            <p className="mb-2">
                                <span className="font-semibold text-gray-100">주연: </span>
                                {/* cast 배열에서 상위 3명의 이름만 가져와서 ", "로 연결합니다. */}
                                {credits.cast.slice(0, 3).map(person => person.name).join(', ')}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-100">장르: </span>
                                {/* genres 배열에서 상위 3개의 장르 이름만 가져와서 ", "로 연결합니다. */}
                                {movieDetail.genres.slice(0, 3).map(genre => genre.name).join(', ')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 중간 상세 정보 섹션 (새로 추가) --- */}

            <div ref={plotRef} className="p-10 md:p-20 grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* 1. 줄거리 구역 */}
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold   pb-2 mb-2">줄거리</h2>
                    <p className="text-gray-300 leading-relaxed">{movieDetail.overview}</p>
                </div>

                {/* 2. 영화정보 구역 */}
                <div>
                    <h2 className="text-3xl font-bold  pb-2 mb-2">영화정보</h2>
                    <div className="space-y-3 text-gray-300">
                        <p>
                            <span className="font-semibold text-white">감독: </span>
                            {/* crew 배열에서 'Director'를 찾아서 이름을 표시합니다. */}
                            {credits.crew.find(person => person.job === 'Director')?.name || '정보 없음'}
                        </p>
                        <p>
                            <span className="font-semibold text-white">출연: </span>
                            {credits.cast.slice(0, 5).map(person => person.name).join(', ')}
                        </p>
                        <p>
                            <span className="font-semibold text-white">장르: </span>
                            {movieDetail.genres.map(g => g.name).join(' | ')}
                        </p>
                        <p>
                            <span className="font-semibold text-white">개봉일: </span>
                            {movieDetail.release_date}
                        </p>
                        <p>
                            <span className="font-semibold text-white">러닝타임: </span>
                            {movieDetail.runtime}분
                        </p>
                    </div>
                </div>
            </div>


            {/* --- 3. 하단 주요 출연진 섹션 (기존과 거의 동일) --- */}
            <div className="px-10 md:px-20 pb-20">
                <h2 className="text-3xl font-bold mb-4  pb-2">출연진</h2>
                <div className="relative">
                    {/* 왼쪽 화살표 버튼 */}
                    {canScrollLeft && (
                        <button
                            onClick={() => handleScroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                             bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-all"
                        >
                            &#x25C0;
                        </button>
                    )}

                    {/* 👇 스크롤이 일어나는 div는 반드시 하나여야 하며, 여기에 ref를 직접 연결합니다. */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto space-x-4 mt-6 pb-4 scrollbar-hide gap-4"
                    >
                        {credits.cast.map((person) => (
                            <div key={person.cast_id} className="text-center w-36 flex-shrink-0">
                                <img
                                    src={
                                        person.profile_path
                                            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                                            : 'https://via.placeholder.com/185x278?text=No+Image'
                                    }
                                    alt={person.name}
                                    className="rounded-lg shadow-lg mx-auto mb-2 w-full h-auto object-cover"
                                />
                                <p className="font-semibold text-sm truncate">{person.name}</p>
                                <p className="text-xs text-gray-400 truncate">{person.character} 역</p>
                            </div>
                        ))}
                    </div>

                    {/* 오른쪽 화살표 버튼 */}
                    {canScrollRight && (
                        <button
                            onClick={() => handleScroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                             bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-all"
                        >
                            &#x25B6;
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MovieDetailPage