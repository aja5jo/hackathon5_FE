import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import KakaoMap from '../components/map/KakaoMap';
import { useAuth } from '../contexts/AuthContext';
import { isMerchant } from '../services/api';

import bannerImg from '../assets/banner.png';
import EventCard from '../components/common/EventCard';
import { favoritesAPI } from '../services/api';
// import { bucketListAPI } from '../services/api'; // 명세서에 없는 API이므로 제거

function BucketList() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMerchantUser, setIsMerchantUser] = useState(false);
  
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 카테고리 필터
  const categories = ['전체', '카페', 'KPOP', '쇼핑', '문화생활', '클럽', '음식점', '이벤트'];

  // 컴포넌트 마운트 시 사용자 타입 확인
  useEffect(() => {
    setIsMerchantUser(isMerchant());
  }, []);

  // 데이터 로드 함수
  const loadFavorites = async () => {
    try {
      const result = await favoritesAPI.getFavorites();
      // API 응답 구조에 맞게 처리
      if (result.success && result.data) {
        setFavorites(result.data);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('즐겨찾기 로드 실패:', error);
      
      // API 호출 실패 시 빈 배열로 설정 (로그인 상태는 유지)
      // 인증 상태는 AuthContext에서 관리하므로 여기서는 리다이렉트하지 않음
      console.log('즐겨찾기 API 호출 실패, 빈 목록으로 표시');
      setFavorites([]);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    console.log('BucketList - 인증 상태 확인:', { isAuthenticated });
    console.log('BucketList - 로컬스토리지 user:', localStorage.getItem('user'));
    
    // 소상공인은 버킷리스트 접근 불가
    if (isMerchantUser) {
      console.log('BucketList - 소상공인은 버킷리스트에 접근할 수 없습니다.');
      navigate('/');
      return;
    }
    
    if (isAuthenticated) {
      console.log('BucketList - 인증된 사용자, 즐겨찾기 로드');
      loadFavorites();
    } else {
      // 인증되지 않은 경우 로그인 페이지로 리다이렉트
      console.log('BucketList - 인증되지 않은 사용자, 로그인 페이지로 이동');
      navigate('/login');
    }
  }, [isAuthenticated, isMerchantUser]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handleRemoveFavorite = async (id, type) => {
    try {
      // API 호출 시도 - 아이템 타입에 따라 처리
      await favoritesAPI.removeFavorite(id, type);
      
      // 성공 시 로컬 상태 업데이트
      const updatedFavorites = favorites.filter(item => item.id !== id);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('즐겨찾기 삭제 실패:', error);
      // API 실패 시에도 로컬 상태 업데이트 (사용자 경험 개선)
      const updatedFavorites = favorites.filter(item => item.id !== id);
      setFavorites(updatedFavorites);
    }
  };

  const handleItemClick = (item) => {
    // 상세페이지로 이동
    if (item.type === 'event') {
      navigate(`/lookmore/${item.category}/event/${item.id}`);
    } else {
      navigate(`/lookmore/${item.category}/store/${item.id}`);
    }
  };

  const getFilteredItems = () => {
    if (selectedCategory === '전체') return favorites;
    return favorites.filter(item => item.category === selectedCategory);
  };

  const filteredItems = getFilteredItems();

  // 지도 마커 데이터 생성
  const mapMarkers = favorites.map(item => ({
    id: item.id,
    name: item.name,
    position: typeof item.location === 'object' ? item.location : { lat: 37.5563, lng: 126.9244 }, // 홍대 중심 좌표
    category: item.category
  }));

  return (
    <Container>
      {/* 배너 섹션 */}
      <BannerSection>
        <BannerContent>
          <BannerTitle>버킷리스트</BannerTitle>
          <BannerSubtitle>나만의 특별한 장소와 경험을 모아보세요</BannerSubtitle>
        </BannerContent>
      </BannerSection>

      {/* 카테고리 필터 */}
      <FilterSection>
        <FilterContainer>
          {categories.map((category) => (
            <FilterButton
              key={category}
              active={selectedCategory === category}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FilterContainer>
      </FilterSection>

      {/* 현재 상태 표시 */}
      <StatusSection>
        <StatusInfo>
          <CurrentTab>버킷리스트</CurrentTab>
          <ItemCount>{filteredItems.length}개 항목</ItemCount>
        </StatusInfo>
      </StatusSection>

      {/* 네이버 지도 섹션 */}
      <MapSection>
        <SectionTitle>🗺️ 홍대 지역 지도</SectionTitle>
        <MapDescription>
          버킷리스트의 장소들이 위치한 홍대 지역을 확인해보세요
        </MapDescription>
        <KakaoMap 
          markers={mapMarkers}
        />
      </MapSection>

      {/* 아이템 그리드 */}
      <ItemGrid>
        {filteredItems.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📝</EmptyIcon>
            <EmptyTitle>버킷리스트가 비어있습니다</EmptyTitle>
            <EmptyDescription>
              관심있는 가게나 이벤트에 하트를 눌러보세요!
            </EmptyDescription>
          </EmptyState>
        ) : (
          filteredItems.map((item) => (
            <EventCard 
              key={item.id} 
              event={item}
              excludeStatuses={[]}
              onRemove={(id) => handleRemoveFavorite(id, item.type)}
            />
          ))
        )}
      </ItemGrid>

      <Footer />
    </Container>
  );
}

export default BucketList;

// 스타일 컴포넌트들
const Container = styled.div`
  background-color: #f8f9fa;
  width: 100%;
`;

const BannerSection = styled.div`
  width: 100%;
  height: 300px;
  background: 
    linear-gradient(0deg, rgba(102, 92, 14, 0.3) 0%, rgba(102, 92, 14, 0.3) 100%),
    url(${bannerImg});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerContent = styled.div`
  text-align: center;
  color: white;
`;

const BannerTitle = styled.h1`
  font-size: 5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -2px;
`;

const BannerSubtitle = styled.p`
  font-size: 1.8rem;
  font-weight: 400;
  color: white;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const FilterSection = styled.div`
  background-color: white;
  padding: 2rem 0;
  border-bottom: 1px solid #e9ecef;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FilterButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.active ? '#FEE502' : '#f8f9fa'};
  color: ${props => props.active ? '#262626' : '#666'};
  border: none;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#E6CF00' : '#e9ecef'};
  }
`;

const StatusSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CurrentTab = styled.div`
  padding: 0.8rem 1.5rem;
  background-color: #FEE502;
  color: #262626;
  border-radius: 20px;
  font-size: 1.6rem;
  font-weight: 600;
`;

const ItemCount = styled.div`
  font-size: 1.4rem;
  color: #666;
  font-weight: 500;
`;

const MapSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 1rem 0;
  text-align: center;
`;

const MapDescription = styled.p`
  font-size: 1.4rem;
  color: #666;
  text-align: center;
  margin: 0 0 2rem 0;
  line-height: 1.5;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem 2rem;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
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