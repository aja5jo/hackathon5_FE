import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HeaderLayout from './layouts/HeaderLayout';
import Home from './pages/Home';
import Category1 from './pages/Category1';
import Category2 from './pages/Category2';
import MoreListmain from './pages/MoreListmain';
import MoreListcategory from './pages/MoreListcategory';
import Event from './pages/Event';
import PopUp from './pages/PopUp';
import BucketList from './pages/BucketList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Lookmore from './pages/Lookmore';
import EventDetail from './pages/EventDetail';
import StoreDetail from './pages/StoreDetail';
import PopupDetail from './pages/PopupDetail';
import MerchantStore from './pages/merchant/MerchantStore';
import MerchantEvent from './pages/merchant/MerchantEvent';
import MerchantEventEdit from './pages/merchant/MerchantEventEdit';
import MerchantEventPartialEdit from './pages/merchant/MerchantEventPartialEdit';
import ImageTranslationTest from './pages/ImageTranslationTest';
import HtmlTranslationTest from './pages/HtmlTranslationTest';
import MerchantPopup from './pages/merchant/MerchantPopup';
import MerchantStoreList from './pages/merchant/MerchantStoreList';
import MerchantEventList from './pages/merchant/MerchantEventList';
import MerchantStoreEdit from './pages/merchant/MerchantStoreEdit';
import MerchantStorePartialEdit from './pages/merchant/MerchantStorePartialEdit';
import AiPreviewTest from './pages/AiPreviewTest';
import MerchantMypage from './pages/merchant/MerchantMypage';
import MerchantSettings from './pages/merchant/MerchantSettings';
import MyPage from './pages/MyPage';
import UserMypage from './pages/user/UserMypage';
import UserReviews from './pages/user/UserReviews';
import UserHistory from './pages/user/UserHistory';
import UserSettings from './pages/user/UserSettings';
import UserRatings from './pages/user/UserRatings';

// 임시 페이지 컴포넌트들
const TempPage = ({ title, description }) => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center'
  }}>
    <h1 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>{title}</h1>
    <p style={{ fontSize: '1.6rem', color: '#666' }}>{description}</p>
    <button 
      onClick={() => window.history.back()} 
      style={{
        marginTop: '2rem',
        padding: '1rem 2rem',
        background: '#FEE502',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1.4rem',
        cursor: 'pointer'
      }}
    >
      뒤로 가기
    </button>
  </div>
);

const router = createBrowserRouter([
  // 모든 라우트를 AuthProvider 내부에서 처리
  {
    path: "/",
    element: <HeaderLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // 로그인과 회원가입은 헤더 없이 렌더링
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
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
        path: "mypage",
        element: <MyPage />,
      },
      {
        path: "merchants/mypage",
        element: <MerchantMypage />,
      },
      {
        path: "merchants/settings",
        element: <MerchantSettings />,
      },
      {
        path: "events",
        element: <Event />,
      },
      {
        path: "popup",
        element: <PopUp />,
      },
      {
        path: "favorites",
        element: <BucketList />,
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
        path: "store/:storeId",
        element: <StoreDetail />,
      },
      {
        path: "popup/:popupId",
        element: <PopupDetail />,
      },
      {
        path: "merchants/stores",
        element: <MerchantStore />,
      },
      {
        path: "merchants/stores/events",
        element: <MerchantEvent />,
      },
      {
        path: "merchants/popups",
        element: <MerchantPopup />,
      },
      {
        path: "mypage/stores",
        element: <MerchantStoreList />,
      },
      {
        path: "merchants/stores/:storeId/edit",
        element: <MerchantStoreEdit />,
      },
      {
        path: "merchants/stores/:storeId/partial-edit",
        element: <MerchantStorePartialEdit />,
      },
      {
        path: "mypage/events",
        element: <MerchantEventList />,
      },
      {
        path: "merchants/events/:eventId/edit",
        element: <MerchantEventEdit />,
      },
      {
        path: "merchants/events/:eventId/partial-edit",
        element: <MerchantEventPartialEdit />,
      },
      {
        path: "mypage/popups",
        element: <MerchantEventList />,
      },
      // 일반 유저 마이페이지 관련 라우트들
      {
        path: "mypage/reviews",
        element: <UserReviews />,
      },
      {
        path: "mypage/history",
        element: <UserHistory />,
      },
      {
        path: "mypage/ratings",
        element: <UserRatings />,
      },
      {
        path: "mypage/reservations",
        element: <TempPage title="예약 내역" description="이벤트 예약 내역을 확인할 수 있습니다." />,
      },
      {
        path: "mypage/tickets",
        element: <TempPage title="티켓 관리" description="구매한 티켓들을 관리할 수 있습니다." />,
      },
      {
        path: "mypage/settings",
        element: <UserSettings />,
      },
      {
        path: "mypage/notifications",
        element: <TempPage title="알림 설정" description="알림 설정을 관리할 수 있습니다." />,
      },
      {
        path: "mypage/privacy",
        element: <TempPage title="개인정보 관리" description="개인정보를 관리할 수 있습니다." />,
      },
      {
        path: "mypage/support",
        element: <TempPage title="문의하기" description="고객지원팀에 문의할 수 있습니다." />,
      },
      {
        path: "mypage/faq",
        element: <TempPage title="자주 묻는 질문" description="자주 묻는 질문들을 확인할 수 있습니다." />,
      },
      {
        path: "mypage/statistics",
        element: <TempPage title="방문 통계" description="방문 통계를 확인할 수 있습니다." />,
      },
      {
        path: "mypage/analytics",
        element: <TempPage title="활동 분석" description="나의 활동을 분석할 수 있습니다." />,
      },
      {
        path: "image-translation-test",
        element: <ImageTranslationTest />,
      },
      {
        path: "html-translation-test",
        element: <HtmlTranslationTest />,
      },
      {
        path: "ai-preview-test",
        element: <AiPreviewTest />,
      },
    ],
  },
]);

export default router;