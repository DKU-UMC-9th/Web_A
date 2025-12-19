import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useThrottle } from '../hooks/useThrottle';

export default function ScrollToTopButton() {
    const [scrollY, setScrollY] = useState(0);

    // useThrottle을 활용하여 스크롤 이벤트를 300ms 간격으로 제한
    // 빠른 스크롤 시에도 성능 최적화
    const throttledScrollY = useThrottle(scrollY, 300);

    useEffect(() => {
        // 스크롤 이벤트 핸들러
        const handleScroll = () => {
            // 스크롤 위치를 state에 저장 (이 값이 useThrottle로 쓰로틀됨)
            setScrollY(window.scrollY);
        };

        // 스크롤 이벤트 리스너 등록
        window.addEventListener('scroll', handleScroll);

        // 클린업: 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // 맨 위로 스크롤하는 함수
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 쓰로틀된 스크롤 값이 300px 이상일 때만 버튼 표시
    if (throttledScrollY < 300) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="맨 위로 가기"
        >
            <ArrowUp className="w-6 h-6" />
        </button>
    );
}
