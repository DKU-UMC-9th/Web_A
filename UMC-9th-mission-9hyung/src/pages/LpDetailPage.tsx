import React from 'react';
import { useParams } from 'react-router-dom';
import useGetLpById from '../hooks/queries/useGetLpById';
// (아이콘이 필요하면 임포트)
// import { FaTrash, FaPen, FaHeart } from 'react-icons/fa';

// (HomePage에서 사용한 스켈레톤 컴포넌트 재사용)
const LpDetailSkeleton = () => (
  <div className="animate-pulse p-8 max-w-2xl mx-auto">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="aspect-square bg-gray-200 rounded-md mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
  </div>
);

const LpDetailPage = () => {
  // 1. URL 파라미터에서 lpid를 가져옵니다.
  const { lpid } = useParams<{ lpid: string }>();

  // 2. [체크리스트 1] 커스텀 훅으로 데이터 페칭
  const { data, isPending, isError, refetch } = useGetLpById(lpid);

  // 3. [체크리스트 4] 로딩 상태
  if (isPending) {
    return <LpDetailSkeleton />;
  }

  // 4. [체크리스트 4] 에러 상태
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <span>데이터를 불러오는 데 실패했습니다.</span>
        <button
          onClick={() => refetch()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 5. 성공 시 렌더링 (data가 있다고 가정)
  // (API 응답이 CommonResponse<LpItem> 이므로 data.data로 접근)
  const lp = data?.data;

  if (!lp) {
    return <div>데이터가 없습니다.</div>; // (데이터가 없는 경우 예외 처리)
  }

  // (간단한 상대 시간 계산)
  const timeAgo = (dateString: string) => {
    // ... (LpCard에서 사용한 timeAgo 함수 복사)
    return `${dateString.split('T')[0]}`; // (간단하게 날짜만 표시)
  };

  return (
    // [체크리스트 2] 섹션 레이아웃 (스크린샷 참고)
    <div className="bg-white p-8 max-w-3xl mx-auto shadow-md rounded-lg mt-10">
      
      {/* --- 상단: 작성자, 날짜, 수정/삭제 --- */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {/* (아바타가 있다면) <img src={lp.author.avatar} /> */}
          <span className="font-bold text-lg">{lp.author.name}</span>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <span>{timeAgo(lp.createdAt)}</span>
          {/* [체크리스트 3] 수정/삭제 버튼 */}
          <button>{/* <FaPen /> */}(수정)</button>
          <button>{/* <FaTrash /> */}(삭제)</button>
        </div>
      </div>

      {/* --- 제목 --- */}
      <h1 className="text-4xl font-bold mb-6">{lp.title}</h1>

      {/* --- 썸네일 --- */}
      <img 
        src={lp.thumbnail} 
        alt={lp.title} 
        className="w-full aspect-square object-contain rounded-md mb-6"
      />

      {/* --- 본문 --- */}
      <p className="text-gray-700 text-lg whitespace-pre-line mb-8">
        {lp.content}
      </p>

      {/* --- 태그 --- */}
      <div className="flex flex-wrap gap-2 mb-8">
        {lp.tags.map((tag) => (
          <span key={tag.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            #{tag.name}
          </span>
        ))}
      </div>

      {/* --- 좋아요 버튼 --- */}
      {/* [체크리스트 3] 좋아요 버튼 */}
      <div className="flex flex-col items-center gap-2">
        <button className="text-red-500 hover:scale-110 transition-transform">
          {/* <FaHeart size={30} /> */}
          (좋아요 ♥)
        </button>
        <span className="font-bold">{lp.likes.length}</span>
      </div>
    </div>
  );
};

export default LpDetailPage;