import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import './App.css'
import HomePage from './pages/Homepage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';
import LpDetailPage from './pages/LpDetailPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

// publicRoutes : 인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[] = [
  {
  path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {index: true, element: <HomePage />},
      {path: 'login', element: <LoginPage />},
      {path: 'signup', element: <SignupPage />},
      {path: 'lp/:lpId', element: <LpDetailPage />},
      {path: 'v1/auth/google/callback', element: <GoogleLoginRedirectPage />},
    ]
  }
];

// protectedRoutes : 인증이 필요한 라우트
const protectedRoutes:RouteObject[] = [
  {
  path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {path: 'my', element: <MyPage />},
      {path: 'mypage', element: <MyPage />},
    ]
  }
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

// React Query Client 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
