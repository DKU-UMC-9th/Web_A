import React, { memo } from 'react'

interface SearchFormProps {
  query: string
  setQuery: (query: string) => void
  includeAdult: boolean
  setIncludeAdult: (include: boolean) => void
  language: string
  setLanguage: (language: string) => void
  onSubmit: (e: React.FormEvent) => void
}

const SearchForm = memo(function SearchForm({
  query,
  setQuery,
  includeAdult,
  setIncludeAdult,
  language,
  setLanguage,
  onSubmit,
}: SearchFormProps) {
  console.log('SearchForm rendered')

  return (
    <div className="bg-white shadow-md p-8 mb-8">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {/* 영화 제목 입력 */}
          <div>
            <label className="block text-sm font-semibold mb-2">🎬 영화 제목</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="영화 제목을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 성인 콘텐츠 체크박스 */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeAdult}
                onChange={(e) => setIncludeAdult(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">성인 콘텐츠 포함</span>
            </label>
          </div>

          {/* 언어 선택 */}
          <div>
            <label className="block text-sm font-semibold mb-2">🌐 언어</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ko-KR">한국어</option>
              <option value="en-US">영어</option>
              <option value="ja-JP">일본어</option>
            </select>
          </div>

          {/* 검색 버튼 */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            🔍 검색하기
          </button>
        </div>
      </form>
    </div>
  )
})

export default SearchForm
