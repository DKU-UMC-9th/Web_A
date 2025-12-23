import { useParams } from 'react-router-dom';

export default function MovieDetailPage() {
    const { movieId } = useParams();
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">Movie ID: {movieId} 상세 페이지</h1>
        </div>
    );
}