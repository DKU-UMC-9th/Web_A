import { useState } from "react";
import type { MovieFilters, MovieLanguage } from "../types/movie";
import { Input } from "./Input";
import { SelectBox } from "./SelectBox";
import { LANGUAGE_OPTIONS } from "../constants/movie";
import { LanguageSelector } from "./LanguageSelector";
import { memo } from "react";

interface MovieFilterProps {
    onChange: (filter: MovieFilters) => void;
}



const MovieFilter = ({ onChange }: MovieFilterProps) => {
    const [query, setQuery] = useState<string>("");
    const [includeAdult, setIncludeAdult] = useState<boolean>(false);
    const [language, setLanguage] = useState<MovieLanguage>("ko-KR");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const filters: MovieFilters = {
            query,
            include_adult: includeAdult,
            language,
        }
        onChange(filters);
        console.log(filters);
    }

    return (
        <form onSubmit={handleSubmit} className="transform space-y-6 rounded-2xl border-gray-300 bg-white
        p-6 shadow-xl transition-all hover:shadow-2xl">
            <div className="flex flex-wrap gap-6">
                <div className="min-w-[450px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        영화 제목
                    </label>
                    <Input value={query} onChange={setQuery} placeholder="영화 제목을 입력해주세요" />
                </div>

                <div className="min-w-[250px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        옵션 선택
                    </label>
                    <SelectBox checked={includeAdult} onChange={setIncludeAdult} label="성인 영화 포함"
                        id="include_adult"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2
                    shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>

                <div className="min-w-[250px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        언어
                    </label>
                    <LanguageSelector value={language} onChange={(value) => setLanguage(value as MovieLanguage)} className="w-full rounded-lg border border-gray-300 px-4 py-2
                    shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        options={LANGUAGE_OPTIONS} />
                </div>

                <div className="pt-4">
                    <button onClick={handleSubmit}
                        className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-white
                        hover:bg-blue-700">영화 검색</button>
                </div>
            </div>
        </form>
    )
}

export default memo(MovieFilter);