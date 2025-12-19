import { useState, useCallback, memo } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar(): React.ReactElement {
    // 검색어 상태
    const [searchQuery, setSearchQuery] = useState<string>("");
    // 성인 콘텐츠 포함 여부 상태
    const [includeAdult, setIncludeAdult] = useState<boolean>(false);
    // 언어 선택 상태
    const [language, setLanguage] = useState<string>("ko-KR");

    const navigate = useNavigate();

    // 검색 폼 제출 핸들러 (useCallback으로 메모이제이션)
    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            return;
        }

        // 검색 결과 페이지로 이동하면서 쿼리 파라미터 전달
        const params = new URLSearchParams({
            q: searchQuery.trim(),
            include_adult: includeAdult.toString(),
            language: language,
        });

        navigate(`/search?${params.toString()}`);
    }, [searchQuery, includeAdult, language, navigate]);

    // input 변경 핸들러
    const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(e.target.value);
    }, []);

    const handleAdultChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        setIncludeAdult(e.target.checked);
    }, []);

    const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
        setLanguage(e.target.value);
    }, []);

    return (
        <div className="bg-gray-900 p-4 shadow-lg border-b border-gray-700">
            <div className="max-w-6xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* 첫 번째 줄: 검색 입력과 버튼 */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="영화 제목을 입력하세요"
                            value={searchQuery}
                            onChange={handleQueryChange}
                            className="flex-1 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg
                                     text-white placeholder-gray-300 focus:outline-none focus:ring-2
                                     focus:ring-pink-400 focus:border-transparent transition-all"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-pink-600 hover:bg-pink-700
                                     text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            검색
                        </button>
                    </div>

                    {/* 두 번째 줄: 체크박스와 언어 선택 */}
                    <div className="flex items-center gap-6">
                        {/* 성인 콘텐츠 포함 체크박스 */}
                        <label className="flex items-center gap-2 cursor-pointer text-white">
                            <input
                                type="checkbox"
                                checked={includeAdult}
                                onChange={handleAdultChange}
                                className="w-4 h-4 text-pink-500 bg-white/20 border-white/30
                                         rounded focus:ring-pink-400 focus:ring-2 cursor-pointer"
                            />
                            <span className="text-sm font-medium">성인 콘텐츠 포함</span>
                        </label>

                        {/* 언어 선택 */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="language" className="text-sm font-medium text-white">
                                언어:
                            </label>
                            <select
                                id="language"
                                value={language}
                                onChange={handleLanguageChange}
                                className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg
                                         text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400
                                         focus:border-transparent cursor-pointer"
                            >
                                <option value="ko-KR" className="bg-purple-900">한국어</option>
                                <option value="en-US" className="bg-purple-900">영어</option>
                                <option value="ja-JP" className="bg-purple-900">일본어</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

// memo로 감싸서 불필요한 리렌더링 방지
export default memo(SearchBar);
