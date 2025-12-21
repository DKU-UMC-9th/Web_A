import { useParams, useNavigate } from 'react-router-dom'

export default function MovieDetail() {
    const { movieId } = useParams()
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-4">영화 상세 페이지</h1>
                <p className="text-gray-600 mb-6">
                    영화 ID: <span className="font-bold text-blue-500">{movieId}</span>
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    홈으로 돌아가기
                </button>
            </div>
        </div>
    )
}
