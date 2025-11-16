import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpById } from "../apis/lp";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import type { CommentItem } from "../types/lpComments";
import { PAGINATION_ORDER, type PaginationOrder } from "../enums/common";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { deleteLike, postLike } from "../apis/lpLikes";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import { QUERY_KEY } from "../constants/key";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import usePostComment from "../hooks/mutations/usePostComment";
import useEditComment from "../hooks/mutations/useEditComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import LpCommentItem from "../components/LpCommentItem";
import EditLpModal from "../components/EditLpModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import useDeleteLp from "../hooks/mutations/useDeleteLp";

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
  const navigate = useNavigate();

  const { lpid } = useParams<{ lpid: string }>();
  const { accessToken } = useAuth();

  const { data: me } = useGetMyInfo(accessToken);

  const [order, setOrder] = useState<PaginationOrder>(PAGINATION_ORDER.desc);
  const [commentInput, setCommentInput] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ✅ LP 상세 정보 불러오기
  // const {
  //   data: lpData,
  //   isLoading: isLpLoading,
  //   isError: isLpError,
  // } = useQuery({
  //   queryKey: [QUERY_KEY.lps, lpid],
  //   queryFn: () => getLpById(lpid!),
  //   enabled: !!lpid,
  // });

  // LP 상세 정보 불러오기
  const {
    data: lpData,
    isPending: isLpLoading,
    isError: isLpError,
  } = useGetLpDetail({ lpId: Number(lpid) });

  // ✅ 댓글 목록 (무한스크롤)
  const {
    data,
    isFetchingNextPage,
    isPending,
    fetchNextPage,
    hasNextPage,
    isError: isCommentError,
  } = useGetLpComments(Number(lpid), order);

  // mutate -> 비동기 요청을 실행하고, 콜백 함수를 이용해서 후속 작업 처리함
  // mutateAsync -> Promise를 반환해서 await 사용 가능
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  const { mutate: postComment } = usePostComment(Number(lpid));

  const deleteLpMutation = useDeleteLp(Number(lpid));

  const isLiked = lpData?.data.likes
    .map((like) => like.userId)
    .includes(me?.data.id as number);

  const handleLikeLp = () => {
    likeMutate(Number(lpid));
  };

  const handleDislikeLp = () => {
    disLikeMutate(Number(lpid));
  };

  const handleSubmitComment = () => {
    if (!commentInput.trim()) return;

    if (!accessToken) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    postComment(
      { content: commentInput.trim() },
      {
        onSuccess: () => {
          setCommentInput("");
        },
      },
    );
  };

  if (!lpid) {
    return (
      <div className="text-center text-gray-400 mt-10">
        잘못된 접근입니다. LP ID가 존재하지 않습니다.
      </div>
    );
  }

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
    <>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-[#1E1E1E] text-gray-200 rounded-xl shadow-md">
        {/* ✅ LP 정보 */}
        <div className="flex flex-col md:flex-row gap-6 border-b border-gray-700 pb-6 mb-4">
          {/* LP 이미지 */}
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-48 h-48 rounded-lg object-cover flex-shrink-0"
          />

          {/* LP 텍스트 정보 */}
          <div className="flex-1 flex flex-col gap-3">
            {/* 제목 */}
            <h1 className="text-2xl font-bold">{lp.title}</h1>

            {/* 내용 */}
            <p className="text-gray-400">{lp.content}</p>
          </div>
        </div>

        <div className="mb-4">
          {/* 🔥 태그 나열 */}
          {lp.tags && lp.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {lp.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-2 rounded-md bg-gray-700 text-sm text-gray-200"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 🔥 작성자 + 업로드일 */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-300 mt-2">
            <span>작성자: {lp.author?.name ?? "익명"}</span>
            <span>
              업로드일: {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>

        {/* 🔥 본인 글일 때만 수정/삭제 버튼 표시 */}
        {me?.data.id === lp.authorId && (
          <div className="flex gap-3 mb-4 ">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-500 cursor-pointer"
            >
              수정하기
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-500 cursor-pointer"
            >
              삭제하기
            </button>
          </div>
        )}

        {/* 🔥 좋아요 버튼 — 댓글 위로 이동 */}
        <div className="flex items-center gap-2 mb-2 text-gray-300">
          <button onClick={isLiked ? handleDislikeLp : handleLikeLp}>
            <Heart
              color={isLiked ? "red" : "white"}
              fill={isLiked ? "red" : "transparent"}
            />
          </button>
          <span className="text-sm">{lp.likes?.length ?? 0}</span>
        </div>

        {/* ✅ 댓글 섹션 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">댓글</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setOrder(PAGINATION_ORDER.desc)}
              className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                order === PAGINATION_ORDER.desc
                  ? "bg-white text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setOrder(PAGINATION_ORDER.asc)}
              className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
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
            onClick={handleSubmitComment}
            disabled={!commentInput.trim()}
            className={`px-4 py-2 rounded-md font-semibold cursor-pointer ${
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
              page.data.data.map((comment: CommentItem) => (
                <LpCommentItem
                  key={comment.id}
                  comment={comment}
                  lpId={Number(lpid)}
                />
              )),
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
      {/* 🔥 LP 수정 모달 */}
      {showEditModal && (
        <EditLpModal
          lp={lp}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* 🔥 LP 삭제 모달 (기존 ConfirmDeleteModal 재사용) */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          open={showDeleteModal}
          message="정말 이 LP를 삭제하시겠습니까?"
          onConfirm={() => {
            deleteLpMutation.mutate(undefined, {
              onSuccess: () => navigate("/"), // 삭제 후 홈으로 이동
            });
          }}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
