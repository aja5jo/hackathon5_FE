import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/common/Header'
import ErrorBoundary from '../components/common/ErrorBoundary'
import styled from 'styled-components';

function HeaderLayout() {
  const location = useLocation();
  
  return (
    <LayoutWrapper>
        <Header/>
        <ContentWrapper id="viewer" key={location.pathname}>
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
    padding-top: 64px; /* header의 높이만큼 내리기 */
    min-height: calc(100vh - 64px);
    width: 100%;
    position: relative;
    overflow: hidden; /* 이전 콘텐츠가 넘치지 않도록 */
`;

export default HeaderLayout