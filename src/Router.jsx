import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';

const router = createBrowserRouter([
    // {
    //  path: "/",
    //  element: <HeaderLayout />,
    // children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
    // ],
    // }
])

export default router;