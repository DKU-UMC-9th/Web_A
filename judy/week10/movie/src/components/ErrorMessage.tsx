interface ErrorMessageProps {
    message?: string;
}

export const ErrorMessage = ({ message = '에러가 발생했습니다.' }: ErrorMessageProps): React.ReactElement => {
    return (
        <div className="flex items-center justify-center h-dvh">
            <div className="text-center">
                <div className="mb-4 text-6xl">⚠️</div>
                <h2 className="text-2xl font-bold text-red-500 mb-2">문제가 발생했습니다</h2>
                <p className="text-gray-400">{message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-3 bg-[#dda5e3] text-white rounded-lg hover:bg-[#b2dab1] transition-all duration-200"
                >
                    다시 시도
                </button>
            </div>
        </div>
    );
};
