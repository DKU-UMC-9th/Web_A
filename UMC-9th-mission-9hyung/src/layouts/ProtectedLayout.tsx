import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import AuthGuardModal from "../components/AuthGuardModal";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) setOpen(true);
    else setOpen(false);
  }, [accessToken, location.pathname]);

  const handleConfirm = () => {
    setOpen(false);
    navigate("/login", { state: { from: location.pathname }, replace: true });
  };

  const handleCancel = () => {
    setOpen(false);
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  if (!accessToken && open) {
    // 모달만 보여주고, 본문은 비활성화
    return (
      <>
        <AuthGuardModal open={open} onConfirm={handleConfirm} onCancel={handleCancel} />
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      </>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-[#f8f9fa]">
      <Navbar />
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
