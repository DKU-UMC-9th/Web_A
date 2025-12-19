import { Outlet } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import SearchBar from "../components/SearchBar";

export default function HomePage () : React.ReactElement {
    return (
        <>
            <NavBar />
            <SearchBar />
            <Outlet />
        </>
    )
}