import React, { useEffect, useRef } from "react";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import type { CommentItem } from "../types/lpComments";
import { PAGINATION_ORDER, type PaginationOrder } from "../enums/common";

interface LpCommentListProps {
  lpId: number;
  order: PaginationOrder;
}

// ✅ 스켈레톤 UI
const CommentSkeleton = () => (
  <div className="animate-pulse flex items-start gap-3 py-3 border-b border-gray-700">
    <div className="w-9 h-9 rounded-full bg-gray-600" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-1/3 bg-gray-600 rounded" />
      <div className="h-3 w-3/4 bg-gray-600 rounded" />
    </div>
  </div>
);

export default function LpCommentList({ lpId, order }: LpCommentListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useGetLpComments(lpId, order);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // ✅ IntersectionObserver (무한 스크롤)
  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [observerRef, hasNextPage, fetchNextPage]);

  // ✅ 로딩 상태
  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ✅ 댓글 목록 */}
      {data?.pages.map((page) =>
        page.data.data.map((comment: CommentItem) => {
          const author = comment.author; // ✅ 첫 번째 작성자
          const avatar = author?.avatar;
          const name = author?.name ?? "익명";

          return (
            <div
              key={comment.id}
              className="flex items-start gap-3 py-3 border-b border-gray-700 hover:bg-gray-800 transition-colors rounded-md px-2"
            >
              {/* 아바타 */}
              <div className="flex-shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                    {name[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* 댓글 본문 */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">
                    {name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          );
        })
      )}

      {/* ✅ 추가 페이지 로딩 중 */}
      {isFetchingNextPage &&
        Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={`sk-${i}`} />)}

      {/* 옵저버 감시 div */}
      <div ref={observerRef} className="h-10" />
    </div>
  );
}
 