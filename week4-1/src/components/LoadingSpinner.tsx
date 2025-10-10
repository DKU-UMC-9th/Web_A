
export default function LoadingSpinner({ label = "로딩 중..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent rounded-full" aria-label="loading" />
      <span className="ml-3 text-sm text-gray-600">{label}</span>
    </div>
  );
}
