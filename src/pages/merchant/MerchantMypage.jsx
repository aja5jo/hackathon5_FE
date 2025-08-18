import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MerchantMypageBannerSection from '../../components/merchant/MerchantMypageBannerSection';

function MerchantMypage() {
  const navigate = useNavigate();
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    // 즐겨찾기 개수 계산 (userFavorites에서 가져오기)
    const favorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
    setFavoritesCount(favorites.length);
  }, []);

  return (
    <Container>
      <Header />

      <MerchantMypageBannerSection/>

      <Content>
        <CardGrid>
          {/* 즐겨찾기/버킷리스트 */}
          <NavCard>
            <CardHeader>
              <CardTitle>즐겨찾기 & 버킷리스트</CardTitle>
              <CountBadge>{favoritesCount}개</CountBadge>
            </CardHeader>
            <CardDesc>나만의 특별한 장소와 이벤트 관리</CardDesc>
            <ButtonRow>
              <PrimaryButton onClick={() => navigate('/favorites')}>즐겨찾기 보기</PrimaryButton>
              <GhostButton onClick={() => navigate('/favorites')}>버킷리스트 관리</GhostButton>
            </ButtonRow>
          </NavCard>

          {/* Store */}
          <NavCard>
            <CardHeader>
              <CardTitle>가게 관리</CardTitle>
            </CardHeader>
            <CardDesc>내 가게 등록/조회/수정</CardDesc>
            <ButtonRow>
              <PrimaryButton onClick={() => navigate('/merchants/stores')}>가게 등록하러 가기</PrimaryButton>
              <GhostButton onClick={() => navigate('/mypage/stores')}>내 가게 보기</GhostButton>
              <GhostButton onClick={() => navigate('/mypage/stores')}>가게 정보 수정하기</GhostButton>
            </ButtonRow>
          </NavCard>

          {/* Events */}
          <NavCard>
            <CardHeader>
              <CardTitle>이벤트 관리</CardTitle>
            </CardHeader>
            <CardDesc>내 이벤트 등록/조회/수정</CardDesc>
            <ButtonRow>
              <PrimaryButton onClick={() => navigate('/merchants/stores/events')}>이벤트 등록하러 가기</PrimaryButton>
              <GhostButton onClick={() => navigate('/mypage/events')}>내 이벤트 보기</GhostButton>
              <GhostButton onClick={() => navigate('/mypage/events')}>이벤트 수정하기</GhostButton>
            </ButtonRow>
          </NavCard>

          {/* Popups */}
          <NavCard>
            <CardHeader>
              <CardTitle>팝업 관리</CardTitle>
            </CardHeader>
            <CardDesc>내 팝업 등록/조회/수정</CardDesc>
            <ButtonRow>
              <PrimaryButton onClick={() => navigate('/merchants/popups')}>팝업 등록하러 가기</PrimaryButton>
              <GhostButton onClick={() => navigate('/mypage/popups')}>내 팝업 보기</GhostButton>
              <GhostButton onClick={() => navigate('/mypage/popups')}>팝업 수정하기</GhostButton>
            </ButtonRow>
          </NavCard>

          {/* Settings */}
          <NavCard>
            <CardHeader>
              <CardTitle>설정</CardTitle>
            </CardHeader>
            <CardDesc>사업자 정보 및 계정 설정</CardDesc>
            <ButtonRow>
              <PrimaryButton onClick={() => navigate('/merchants/settings')}>사업자 설정</PrimaryButton>
              <GhostButton onClick={() => navigate('/merchants/settings')}>비밀번호 변경</GhostButton>
              <GhostButton onClick={() => navigate('/merchants/settings')}>계정 관리</GhostButton>
            </ButtonRow>
          </NavCard>
        </CardGrid>
      </Content>

      <Footer />
    </Container>
  );
}

export default MerchantMypage;

// ===== styled =====
const Container = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const Banner = styled.section`
  margin-top: 64px; /* header height offset */
  width: 100%;
  height: 240px;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 1.5rem;
`;

const BannerTitle = styled.h1`
  margin: 0;
  font-size: 2.4rem;
  font-weight: 800;
  color: #262626;
`;

const BannerSubtitle = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 1.4rem;
  color: #666;
`;

const Content = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const NavCard = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CountBadge = styled.span`
  background: #FEE502;
  color: #262626;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
`;

const CardTitle = styled.h2`
  margin: 0 0 0.25rem 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #262626;
`;

const CardDesc = styled.p`
  margin: 0 0 1.25rem 0;
  font-size: 1.3rem;
  color: #6b7280;
`;

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* mobile */
  gap: 0.8rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BaseButton = styled.button`
  height: 44px;
  border-radius: 10px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(BaseButton)`
  background: #FEE502;
  color: #262626;
  border: 2px solid #FEE502;
  &:hover { background: #ffe95a; }
`;

const GhostButton = styled(BaseButton)`
  background: #fff;
  color: #262626;
  border: 2px solid #e5e7eb;
  &:hover { border-color: #FEE502; }
`;