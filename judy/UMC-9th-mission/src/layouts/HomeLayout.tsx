import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

export default function HomeLayout() {
    return(
        <div className="h-dvh flex flex-col bg-black">
            <Header />
            <SideBar />
            <main className="flex-1 lg:ml-64 overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}