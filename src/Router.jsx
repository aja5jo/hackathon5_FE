import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Category2 from './pages/Category2';
import Event from './pages/Event';
import BucketList from './pages/BucketList';
import PopUp from './pages/PopUp';
import HeaderLayout from './layouts/HeaderLayout';
import Detail from './pages/Detail';


const router = createBrowserRouter([
    {
     path: "/",
     element: <HeaderLayout />,
     children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "category",
        element: <Category2 />,
      },
      {
        path: "event",
        element: <Event />,
      },
      {
        path: "popup",
        element: <PopUp />,
      },
      {
        path: "bucketlist",
        element: <BucketList />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "detail",
        element: <Detail />,
      },
      
    ],
    }
])

export default router;