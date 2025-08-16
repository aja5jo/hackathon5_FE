import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Category1 from './pages/Category1';
import Category2 from './pages/Category2';
import Event from './pages/Event';
import BucketList from './pages/BucketList';
import PopUp from './pages/PopUp';
import Lookmore from './pages/Lookmore';
import HeaderLayout from './layouts/HeaderLayout';
import MoreListmain from './pages/moreListmain';
import MoreListcategory from './pages/moreListcategory';
import EventDetail from './pages/EventDetail';
import StoreDetail from './pages/StoreDetail';


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
        path: "categories",
        element: <Category2 />,
      },
      {
        path: "category1",
        element: <Category1 />,
      },
      {
        path: "category2",
        element: <Category2 />,
      },
      {
        path: "morelistmain",
        element: <MoreListmain />,
      },
      {
        path: "categories/:category",
        element: <MoreListcategory />,
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
        path: "signup",
        element: <Signup />,
      },
      {
        path: "lookmore/:category/:itemType/:itemId",
        element: <Lookmore />,
      },
      {
        path: "events/:eventId",
        element: <EventDetail />,
      },
      {
        path: "stores/:storeId",
        element: <StoreDetail />,
      },

      
    ],
    }
])

export default router;