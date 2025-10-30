import './App.css'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage'
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';
//publicRoutes
const publicRoutes:RouteObject[]=[
  {
    path:"/",
    element: <HomeLayout />, //element는 공유되는 구성들이 들어가야함
    errorElement: <NotFoundPage />, 
    children: [
      {index:true, element:<HomePage />}, //index는 path가 없는것
      {path:'login', element:<LoginPage />}, 
      {path:'sign', element:<SignupPage />},
    ],
  }
]
//protectedRoutes
const protectedRoutes:RouteObject[] =[
  {
    path:"/",
    element:<ProtectedLayout/>,
    errorElement:<NotFoundPage/>,
    children: [
      {path:'my', element:<MyPage/>},
    ],
  }
]
const router = createBrowserRouter([
    ...publicRoutes,
  ...protectedRoutes,
]);

function App() {
  return (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
  );
}

export default App
