import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

type SearchType = 'title' | 'tag';

interface SearchBarProps {
    onSearchChange?: (keyword: string, searchType: SearchType) => void;
    initialKeyword?: string;
    initialSearchType?: SearchType;
}

export default function SearchBar({
    onSearchChange,
    initialKeyword = '',
    initialSearchType = 'title'
}: SearchBarProps) {
    const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
    const [searchType, setSearchType] = useState<SearchType>(initialSearchType);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // initialKeyword나 initialSearchType이 변경되면 동기화
    useEffect(() => {
        setSearchKeyword(initialKeyword);
    }, [initialKeyword]);

    useEffect(() => {
        setSearchType(initialSearchType);
    }, [initialSearchType]);

    // 입력값이 변경될 때마다 실시간으로 부모에게 전달
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchKeyword(value);
        if (onSearchChange) {
            onSearchChange(value, searchType);
        }
    };

    // 검색 타입 변경 시에도 부모에게 전달
    const handleSearchTypeChange = (type: SearchType) => {
        setSearchType(type);
        setIsDropdownOpen(false);
        if (onSearchChange) {
            onSearchChange(searchKeyword, type);
        }
    };

    // 폼 제출 시 (엔터 키나 검색 버튼 클릭)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearchChange) {
            onSearchChange(searchKeyword, searchType);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8">
            <div className="flex items-center gap-2">
                {/* 검색 입력창 */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={handleInputChange}
                        placeholder={`${searchType === 'title' ? '제목' : '태그'}으로 검색...`}
                        className="w-full px-4 py-3 pl-12 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {/* 검색 타입 선택 드롭다운 */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 hover:border-pink-500 transition-all min-w-[100px] flex items-center justify-between gap-2"
                    >
                        <span>{searchType === 'title' ? '제목' : '태그'}</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* 드롭다운 메뉴 */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
                            <button
                                type="button"
                                onClick={() => handleSearchTypeChange('title')}
                                className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                                    searchType === 'title' ? 'bg-pink-500/20 text-pink-400' : 'text-white'
                                }`}
                            >
                                제목
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSearchTypeChange('tag')}
                                className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                                    searchType === 'tag' ? 'bg-pink-500/20 text-pink-400' : 'text-white'
                                }`}
                            >
                                태그
                            </button>
                        </div>
                    )}
                </div>

                {/* 검색 버튼 */}
                <button
                    type="submit"
                    className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors font-medium"
                >
                    검색
                </button>
            </div>
        </form>
    );
}
