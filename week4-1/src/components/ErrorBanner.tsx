// src/components/ErrorBanner.tsx
export default function ErrorBanner({
  message = "문제가 발생했어요.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="my-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-800">
      <div className="font-semibold">에러</div>
      <div className="text-sm mt-1">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 inline-flex items-center rounded-lg border px-3 py-1 text-sm hover:bg-red-100"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
