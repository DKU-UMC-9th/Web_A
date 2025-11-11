import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomeLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-[#f8f9fa]">
      <nav className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="text-2xl font-semibold text-blue-600"
            >
                Jiwoo Home
            </Link>
            
          </div>
        </div>
      </nav>
      <Navbar/>
      <main className="flex-1 flex">
        <Outlet />
      </main>
      <Footer/>
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 ssookE's Page. All Rights Reserved.</p>
          <p className="text-gray-400 mt-2">Created for UMC 9th Web Mission</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;