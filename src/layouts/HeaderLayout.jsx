import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header'
import ErrorBoundary from '../components/common/ErrorBoundary'
import styled from 'styled-components';

function HeaderLayout() {
  return (
    <LayoutWrapper>
        <Header/>
        <ContentWrapper id="viewer">
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
`;

export default HeaderLayout