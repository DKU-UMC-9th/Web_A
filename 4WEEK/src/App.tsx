import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage'


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />, //element는 공유되는 구성들이 들어가야함
    errorElement: <NotFoundPage />, 
    children: [
      {index:true, element:<HomePage />}, //index는 path가 없는것
      {path:'login', element:<LoginPage />}, 
      {path:'sign', element:<SignupPage />},
      {path:'my', element:<MyPage/>},
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
