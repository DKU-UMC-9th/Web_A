import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import HomeLayout from './layouts/HomeLayout'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import './App.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { type RouteObject } from 'react-router-dom'
import ProtectedLayout from './layouts/ProtectedLayout.tsx'


const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ]
  }
]

const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/my",
        element: <MyPage />,
      }
    ]
  }
]


const router = createBrowserRouter([...publicRoutes, ...protectedRoutes])



function App() {


  return (
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
