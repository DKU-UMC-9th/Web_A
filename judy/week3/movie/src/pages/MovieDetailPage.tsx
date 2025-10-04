import { useParams } from "react-router-dom"

export default function MovieDetailPage () : React.ReactElement {
    const params = useParams();

    return (
        <>
            <div>상세 페이지 {params.movieId}</div>
        </>
    )
}