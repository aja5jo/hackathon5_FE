import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import NaverMap from '../components/map/NaverMap';
import BucketlistBannerSection from '../components/bucketlist/BucketlistBannerSection';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../contexts/AuthContext';

function BucketList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // 로그인 상태 확인
  useEffect(() => {
    if (!isAuthenticated) {
      // 비회원인 경우 로그인 페이지로 리다이렉트
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // 실제 즐겨찾기 데이터 (로컬스토리지에서 가져오기)
  useEffect(() => {
    if (!isAuthenticated) return; // 로그인하지 않은 경우 데이터 로드하지 않음
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('userFavorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('즐겨찾기 로드 중 오류:', error);
        setFavorites([]);
      }
    };

    loadFavorites();
    
    // 즐겨찾기 변경 이벤트 리스너 추가
    window.addEventListener('favoritesChanged', loadFavorites);
    
    return () => {
      window.removeEventListener('favoritesChanged', loadFavorites);
    };
  }, [isAuthenticated]);

  const handleFavoriteClick = (item) => {
    // 상세페이지로 이동
    try {
      const itemType = (item.type || '').toLowerCase();
      
      if (itemType === 'event') {
        navigate(`/events/${item.id}`);
      } else if (itemType === 'popup') {
        navigate(`/popup/${item.id}`);
      } else if (itemType === 'store') {
        navigate(`/store/${item.id}`);
      } else {
        // 타입이 명확하지 않은 경우, lookmore 라우트 사용
        const categoryLower = (item.category || '').toLowerCase();
        navigate(`/lookmore/${categoryLower}/${itemType}/${item.id}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      navigate('/');
    }
  };

  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter(item => item.id !== id);
    setFavorites(updatedFavorites);
    
    // 로컬스토리지 업데이트
    localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
    
    // 즐겨찾기 변경 이벤트 발생
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  // 지도에 표시할 마커 데이터 생성
  const mapMarkers = favorites.map(item => ({
    id: item.id,
    name: item.name,
    position: item.location || { lat: 37.5563, lng: 126.9244 }, // 기본 위치
    category: item.category
  }));

  // 로그인하지 않은 경우 컴포넌트 렌더링하지 않음 (리다이렉트 처리되므로)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container>
      <Header />
      <BucketlistBannerSection />
      
      {/* 메인 콘텐츠 */}
      <MainContent>
        <ContentWrapper>
          {/* 왼쪽 컬럼 - 즐겨찾기 목록 */}
          <LeftColumn>
            <SectionTitle>{t('myFavorites')}</SectionTitle>
            {favorites.length === 0 ? (
              <EmptyState>
                <EmptyIcon>💔</EmptyIcon>
                <EmptyTitle>{t('noFavorites')}</EmptyTitle>
                <EmptyDescription>
                  {t('noFavoritesDesc')}
                </EmptyDescription>
              </EmptyState>
            ) : (
              <FavoritesList>
                {favorites.map((item) => (
                  <FavoriteItem key={item.id}>
                    <FavoriteButton 
                      onClick={() => handleFavoriteClick(item)}
                    >
                      {item.name}
                    </FavoriteButton>
                    <RemoveButton 
                      onClick={() => handleRemoveFavorite(item.id)}
                      title={t('removeFromFavorites')}
                    >
                      ✕
                    </RemoveButton>
                  </FavoriteItem>
                ))}
              </FavoritesList>
            )}
          </LeftColumn>

          {/* 오른쪽 컬럼 - 네이버 지도 */}
          <RightColumn>
            <MapContainer>
              <MapTitle>{t('favoriteLocation')}</MapTitle>
              <MapDescription>
                {t('favoriteLocationDesc')}
              </MapDescription>
              <NaverMap 
                width="100%" 
                height="400px" 
                center={{ lat: 37.5563, lng: 126.9244 }}
                markers={mapMarkers}
              />
            </MapContainer>
          </RightColumn>
        </ContentWrapper>
      </MainContent>

      <Footer />
    </Container>
  );
}

export default BucketList;

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
`;

const MainContent = styled.div`
  padding: 4rem 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: #262626;
  margin: 0;
`;

const FavoritesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FavoriteItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FavoriteButton = styled.button`
  flex: 1;
  padding: 1.5rem 2rem;
  background-color: #FEE502;
  color: #262626;
  border: 1px solid #000;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    background-color: #E6CF00;
    transform: translateY(-2px);
  }
`;

const RemoveButton = styled.button`
  padding: 0.8rem 1.2rem;
  background-color: #FF6B6B;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #FF5252;
    transform: scale(1.05);
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MapContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const MapTitle = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  color: #262626;
  margin: 0 0 1rem 0;
`;

const MapDescription = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 2rem 0;
  line-height: 1.5;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  font-size: 6rem;
  margin-bottom: 2rem;
`;

const EmptyTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 600;
  color: #666;
  margin: 0 0 1rem 0;
`;

const EmptyDescription = styled.p`
  font-size: 1.6rem;
  color: #888;
  margin: 0;
`;