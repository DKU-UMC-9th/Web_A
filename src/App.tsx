import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import './App.css'
import HomePage from './pages/Homepage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';



// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지


//publicRoutes : 인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {index: true, element: <HomePage />},
      {path: 'login', element: <LoginPage />},
      {path: 'signup', element: <SignupPage />},
    ]

  }

];
//protectRoutes : 인증 후 접근 가능한 라우트

const protectRoutes:RouteObject[] = [
  {
    path:"/",
    element:<ProtectedLayout />,
    errorElement: <NotFoundPage />,   
    children:[
      {
        path:'my',
       element:<MyPage />,
      },
    ],
  }
];

const router = createBrowserRouter([...publicRoutes, ...protectRoutes]);

function App() {
  return(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider> 
  )
}

export default App;
