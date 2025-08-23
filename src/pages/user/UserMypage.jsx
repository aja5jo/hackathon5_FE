import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Footer from '../../components/common/Footer';
import bannerImg from '../../assets/banner.png';

function UserMypage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    // 즐겨찾기 개수 계산 (userFavorites에서 가져오기)
    const favorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
    setFavoritesCount(favorites.length);

    // 더미 데이터로 활동 통계 설정
    setReviewsCount(5);
    setVisitCount(12);
  }, []);

  const handleLogout = async () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      await logout();
      navigate('/');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // 계정 삭제 로직
      localStorage.removeItem('favorites');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      sessionStorage.removeItem('user');
      alert('계정이 삭제되었습니다.');
      navigate('/');
    }
  };

  return (
    <Container>
      <Banner>
        <BannerTitle>마이페이지</BannerTitle>
        <BannerSubtitle>나의 활동과 설정을 관리하세요</BannerSubtitle>
      </Banner>

      <Content>
        <UserInfoSection>
          <UserAvatar>
            <AvatarText>{user?.name?.charAt(0) || 'U'}</AvatarText>
          </UserAvatar>
          <UserDetails>
            <UserName>{user?.name || '사용자'}</UserName>
            <UserEmail>{user?.email || 'user@example.com'}</UserEmail>
          </UserDetails>
        </UserInfoSection>

        <CardGrid>
          {/* 버킷리스트 */}
          <NavCard>
            <CardHeader>
              <CardTitle>버킷리스트</CardTitle>
              <CountBadge>{favoritesCount}개</CountBadge>
            </CardHeader>
            <CardDesc>나만의 특별한 장소와 이벤트 관리</CardDesc>
            <ButtonRow>
              {/* <PrimaryButton onClick={() => navigate('/favorites')}>
                버킷리스트
              </PrimaryButton> */}
              <GhostButton onClick={() => navigate('/favorites')}>
                버킷리스트 관리
              </GhostButton>
            </ButtonRow>
          </NavCard>

          {/* 내 활동 */}
          {/* <NavCard>
            <CardHeader>
              <CardTitle>내 활동</CardTitle>
              <ActivityStats>
                <StatItem>
                  <StatNumber>{reviewsCount}</StatNumber>
                  <StatLabel>리뷰</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>{visitCount}</StatNumber>
                  <StatLabel>방문</StatLabel>
                </StatItem>
              </ActivityStats>
            </CardHeader>
            <CardDesc>리뷰, 평점, 방문 기록</CardDesc>
            <ButtonRow>
              <GhostButton onClick={() => navigate('/mypage/reviews')}>
                내 리뷰 보기
              </GhostButton>
              <GhostButton onClick={() => navigate('/mypage/history')}>
                방문 기록
              </GhostButton>
              <GhostButton onClick={() => navigate('/mypage/ratings')}>
                내 평점
              </GhostButton>
            </ButtonRow>
          </NavCard> */}

          {/* 설정 */}
          <NavCard>
            <CardHeader>
              <CardTitle>설정</CardTitle>
            </CardHeader>
            <CardDesc>개인정보 및 계정 설정</CardDesc>
            <ButtonRow>
              <GhostButton onClick={() => navigate('/mypage/settings')}>
                계정 설정
              </GhostButton>
              <GhostButton onClick={() => navigate('/mypage/notifications')}>
                알림 설정
              </GhostButton>
              <DangerButton onClick={handleLogout}>
                로그아웃
              </DangerButton>
              <DangerButton onClick={handleDeleteAccount}>
                계정 삭제
              </DangerButton>
            </ButtonRow>
          </NavCard>
        </CardGrid>
      </Content>

      <Footer />
    </Container>
  );
}

export default UserMypage;

// ===== styled =====
const Container = styled.div`
  width: 100%;
  background: #ffffff;
`;

const Banner = styled.section`
  width: 100%;
  height: 300px;
  background: 
    linear-gradient(0deg, rgba(102, 92, 14, 0.3) 0%, rgba(102, 92, 14, 0.3) 100%),
    url(${bannerImg});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 1.5rem;
`;

const BannerTitle = styled.h1`
  margin: 0;
  font-size: 5rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -2px;
`;

const BannerSubtitle = styled.p`
  margin: 1rem 0 0 0;
  font-size: 1.8rem;
  font-weight: 400;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #FEE502;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(254, 229, 2, 0.3);
`;

const AvatarText = styled.span`
  font-size: 2.4rem;
  font-weight: 700;
  color: #262626;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 0.5rem 0;
`;

const UserEmail = styled.p`
  font-size: 1.6rem;
  color: #666;
  margin: 0;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NavCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #262626;
  margin: 0;
`;

const CountBadge = styled.span`
  background: #FEE502;
  color: #262626;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ActivityStats = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #FEE502;
`;

const StatLabel = styled.div`
  font-size: 1.2rem;
  color: #666;
  margin-top: 0.2rem;
`;

const CardDesc = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 1.5rem 0;
  line-height: 1.4;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const PrimaryButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 10px;
  padding: 1.2rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ffe95a;
    transform: translateY(-2px);
  }
`;

const GhostButton = styled.button`
  background: transparent;
  color: #666;
  border: 2px solid #E5E5E5;
  border-radius: 10px;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #FEE502;
    color: #262626;
    background: #FFF9C4;
  }
`;

const DangerButton = styled.button`
  background: transparent;
  color: #dc3545;
  border: 2px solid #dc3545;
  border-radius: 10px;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #dc3545;
    color: white;
  }
`;