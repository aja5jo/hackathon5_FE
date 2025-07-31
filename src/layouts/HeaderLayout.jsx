import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header'
import styled from 'styled-components';

function HeaderLayout() {
  return (
    <LayoutWrapper>
        <Header/>
        <ContentWrapper>
            <Outlet />
        </ContentWrapper>
    </LayoutWrapper>
  )
}

const LayoutWrapper = styled.div`
  width: 100%;
`;

const ContentWrapper = styled.main`
    padding-top: 60px;//header의 높이만큼 내리기
`;

export default HeaderLayout