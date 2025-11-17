import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedLayout = () => {

    const {accessToken} = useAuth();
    const location = useLocation();

    if(!accessToken){
        return <Navigate to={"/login"} state={{location }} replace />;
    }

  return (<div className="h-dvh flex flex-col">
            <Navbar />
            <main className="flex-1 mt-10">
                <Outlet />
            </main>
           <Footer />
        </div>);
}

export default ProtectedLayout
