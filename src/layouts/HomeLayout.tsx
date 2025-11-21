import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import FloatingActionButton from "../components/FloatingActionButton";
import CreateLpModal from "../components/CreateLpModal";
import { useSidebar } from "../hooks/useSidebar";

export default function HomeLayout() {
    // useSidebar 커스텀 훅 사용
    const { isOpen: isSidebarOpen, toggle: toggleSidebar, close: closeSidebar } = useSidebar();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

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

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar onToggleSidebar={toggleSidebar} />
            <div className="flex flex-1 pt-[64px]">
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                <main className="flex-1 bg-black transition-all duration-300">
                    <Outlet />
                </main>
            </div>
            <Footer />
            <FloatingActionButton onClick={openModal} />
            <CreateLpModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}
