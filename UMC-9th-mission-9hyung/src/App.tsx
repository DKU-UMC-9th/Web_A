import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import HomeLayout from './layouts/HomeLayout'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import './App.css'

const router = createBrowserRouter([
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
      {
        path: "/my",
        element: <MyPage />,
      }
    ]
  }
])



function App() {


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
