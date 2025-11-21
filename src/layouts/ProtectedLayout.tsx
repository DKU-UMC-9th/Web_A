import { useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSidebar } from '../hooks/useSidebar';

const ProtectedLayout = () => {
    const {accessToken} = useAuth();
    const location = useLocation();
    
    // useSidebar 커스텀 훅 사용
    const { isOpen: isSidebarOpen, toggle: toggleSidebar, close: closeSidebar } = useSidebar();

    // 화면 크기 변경 감지
    useEffect(() => {
        const handleResize = () => {
            // 화면이 절반(768px) 이하로 줄어들면 사이드바 닫기
            if (window.innerWidth < 768 && isSidebarOpen) {
                closeSidebar();
            }
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isSidebarOpen, closeSidebar]);

    if(!accessToken){
        return <Navigate to={"/login"} state={{location }} replace />;
    }

  return (<div className="min-h-screen flex flex-col">
            <Navbar onToggleSidebar={toggleSidebar} />
            <div className="flex flex-1 pt-[64px]">
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                <main className="flex-1 bg-black">
                    <Outlet />
                </main>
            </div>
           <Footer />
        </div>);
}

export default ProtectedLayout
