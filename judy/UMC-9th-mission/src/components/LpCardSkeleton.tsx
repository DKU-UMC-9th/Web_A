export default function LpCardSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-800 animate-pulse">
            {/* 펄스 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
        </div>
    );
}
