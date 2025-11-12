import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpById } from "../apis/lp";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import type { CommentItem } from "../types/lpComments";
import { PAGINATION_ORDER, type PaginationOrder } from "../enums/common";

const CommentSkeleton = () => (
  <div className="animate-pulse flex items-start gap-3 py-3 border-b border-gray-700">
    <div className="w-9 h-9 rounded-full bg-gray-600" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-1/3 bg-gray-600 rounded" />
      <div className="h-3 w-3/4 bg-gray-600 rounded" />
    </div>
  </div>
);

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();

  if (!lpid) {
    return (
      <div className="text-center text-gray-400 mt-10">
        잘못된 접근입니다. LP ID가 존재하지 않습니다.
      </div>
    );
  }
  const [order, setOrder] = useState<PaginationOrder>(PAGINATION_ORDER.desc);
  const [commentInput, setCommentInput] = useState("");

  // ✅ LP 상세 정보 불러오기
  const {
    data: lpData,
    isLoading: isLpLoading,
    isError: isLpError,
  } = useQuery({
    queryKey: ["lpDetail", lpid],
    queryFn: () => getLpById(lpid!),
    enabled: !!lpid,
  });

  // ✅ 댓글 목록 (무한스크롤)
  const {
    data,
    isFetchingNextPage,
    isPending,
    fetchNextPage,
    hasNextPage,
    isError: isCommentError,
  } = useGetLpComments(Number(lpid), order);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("📍 Intersection 감지됨");
          if (hasNextPage && !isFetchingNextPage) {
            console.log("➡️ fetchNextPage 실행");
            fetchNextPage();
          }
        }
      },
      { threshold: 0.5 }, // ✅ 완화
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [observerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);


  useEffect(() => {
  console.log("🔹 hasNextPage:", hasNextPage, "pages:", data?.pages?.length);
}, [hasNextPage, data]);

  // ✅ LP 로딩 중
  if (isLpLoading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-gray-700 rounded" />
          <div className="h-4 w-2/3 bg-gray-700 rounded" />
          <div className="h-4 w-3/5 bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (isLpError || !lpData) {
    return (
      <div className="text-center mt-10 text-red-400">
        LP 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const lp = lpData.data;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-[#1E1E1E] text-gray-200 rounded-xl shadow-md">
      {/* ✅ LP 정보 */}
      <div className="flex flex-col md:flex-row gap-6 border-b border-gray-700 pb-6 mb-6">
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-48 h-48 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{lp.title}</h1>
          <p className="text-gray-400 mb-4">{lp.content}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span>작성자: {lp.author?.name ?? "익명"}</span>
            <span>
              업로드일: {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
            </span>
            <span>좋아요: {lp.likes?.length ?? 0}</span>
          </div>
        </div>
      </div>

      {/* ✅ 댓글 섹션 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">댓글</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={`px-3 py-1 rounded-md font-semibold ${
              order === PAGINATION_ORDER.desc
                ? "bg-white text-black"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={`px-3 py-1 rounded-md font-semibold ${
              order === PAGINATION_ORDER.asc
                ? "bg-white text-black"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      {/* ✅ 댓글 입력 UI */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="댓글을 입력해주세요"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-1 bg-gray-800 text-gray-200 px-3 py-2 rounded-md focus:outline-none"
        />
        <button
          disabled={!commentInput.trim()}
          className={`px-4 py-2 rounded-md font-semibold ${
            commentInput.trim()
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          작성
        </button>
      </div>

      {/* ✅ 댓글 목록 */}
      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      ) : isCommentError ? (
        <div className="text-center text-red-400 mt-10">
          댓글을 불러올 수 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {data?.pages.map((page) =>
            page.data.data.map((comment: CommentItem) => {
              const author = comment.author;
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
                        {new Date(comment.createdAt).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            }),
          )}

          {/* 추가 로딩 시 스켈레톤 */}
          {isFetchingNextPage &&
            Array.from({ length: 5 }).map((_, i) => (
              <CommentSkeleton key={`sk-${i}`} />
            ))}

          <div
            ref={observerRef}
            className="h-40"
          />
        </div>
      )}
    </div>
  );
}
