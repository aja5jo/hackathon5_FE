import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/common/Header'
import ErrorBoundary from '../components/common/ErrorBoundary'
import styled from 'styled-components';

function HeaderLayout() {
  const location = useLocation();
  
  // 로그인과 회원가입 페이지에서는 헤더를 표시하지 않음
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  return (
    <LayoutWrapper>
        {!isAuthPage && <Header/>}
        <ContentWrapper id="viewer" $isAuthPage={isAuthPage}>
            <ErrorBoundary>
                <Outlet />
            </ErrorBoundary>
        </ContentWrapper>
    </LayoutWrapper>
  )
}

const LayoutWrapper = styled.div`
  width: 100%;
`;

const ContentWrapper = styled.main`
    padding-top: ${props => props.$isAuthPage ? '0' : '64px'}; /* 인증 페이지에서는 패딩 제거 */
    min-height: ${props => props.$isAuthPage ? '100vh' : 'calc(100vh - 64px)'};
    width: 100%;
`;

export default HeaderLayout