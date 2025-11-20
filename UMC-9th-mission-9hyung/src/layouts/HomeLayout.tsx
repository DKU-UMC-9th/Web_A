import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";


const HomeLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-[#f8f9fa]">
      <Navbar />
      <Sidebar />

    

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default HomeLayout;
