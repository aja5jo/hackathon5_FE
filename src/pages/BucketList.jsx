import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import NaverMap from '../components/map/NaverMap';
import bannerImg from '../assets/banner.png';
import BucketlistBannerSection from '../components/bucketlist/BucketlistBannerSection';

function BucketList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [bucketList, setBucketList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 카테고리 필터
  const categories = ['전체', '카페', 'KPOP', '쇼핑', '문화생활', '클럽', '음식점', '이벤트'];

  // 더미 즐겨찾기 데이터
  const dummyFavorites = [
    {
      id: 1,
      name: '빈티지라떼',
      category: '카페',
      type: 'store',
      description: '홍대의 유명한 빈티지 감성 카페',
      image: 'https://picsum.photos/seed/fav1/400/300',
      likeCount: 156,
      liked: true,
      addedDate: '2025-01-10'
    },
    {
      id: 2,
      name: 'K-POP 굿즈 팝업',
      category: 'KPOP',
      type: 'event',
      description: '최신 아이돌 굿즈와 포토존',
      image: 'https://picsum.photos/seed/fav2/400/300',
      likeCount: 892,
      liked: true,
      addedDate: '2025-01-08',
      endDate: '2025-01-28'
    },
    {
      id: 3,
      name: '무드브루',
      category: '카페',
      type: 'store',
      description: '아늑한 분위기의 커피 전문점',
      image: 'https://picsum.photos/seed/fav3/400/300',
      likeCount: 234,
      liked: true,
      addedDate: '2025-01-12'
    },
    {
      id: 4,
      name: '홍대 클럽 파티',
      category: '클럽',
      type: 'event',
      description: '주말 특별 DJ 파티',
      image: 'https://picsum.photos/seed/fav4/400/300',
      likeCount: 567,
      liked: true,
      addedDate: '2025-01-09',
      endDate: '2025-01-18'
    }
  ];

  // 더미 버킷리스트 데이터
  const dummyBucketList = [
    {
      id: 5,
      name: '스트리트 아트 전시',
      category: '문화생활',
      type: 'event',
      description: '젊은 아티스트들의 작품 전시',
      image: 'https://picsum.photos/seed/bucket1/400/300',
      priority: 'high',
      addedDate: '2025-01-11',
      targetDate: '2025-01-25',
      completed: false
    },
    {
      id: 6,
      name: '빈티지 마켓',
      category: '쇼핑',
      type: 'store',
      description: '독특한 빈티지 아이템 쇼핑',
      image: 'https://picsum.photos/seed/bucket2/400/300',
      priority: 'medium',
      addedDate: '2025-01-13',
      targetDate: '2025-02-01',
      completed: true
    },
    {
      id: 7,
      name: '음식 페스티벌',
      category: '음식점',
      type: 'event',
      description: '홍대 맛집 페스티벌 참여',
      image: 'https://picsum.photos/seed/bucket3/400/300',
      priority: 'high',
      addedDate: '2025-01-14',
      targetDate: '2025-02-05',
      completed: false
    },
    {
      id: 8,
      name: '사자 베이커리',
      category: '카페',
      type: 'store',
      description: '유명한 베이커리 방문하기',
      image: 'https://picsum.photos/seed/bucket4/400/300',
      priority: 'low',
      addedDate: '2025-01-15',
      targetDate: '2025-02-10',
      completed: false
    }
  ];

  useEffect(() => {
    setFavorites(dummyFavorites);
    setBucketList(dummyBucketList);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCategory('전체');
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleBucketComplete = (id) => {
    setBucketList(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const handleRemoveBucketItem = (id) => {
    setBucketList(prev => prev.filter(item => item.id !== id));
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
    const items = activeTab === 'favorites' ? favorites : bucketList;
    if (selectedCategory === '전체') return items;
    return items.filter(item => item.category === selectedCategory);
  };

  const filteredItems = getFilteredItems();

  return (
    <Container>
      <Header />
      <BucketlistBannerSection />
      

      {/* 탭 섹션 */}
      <TabSection>
        <TabContainer>
          <TabButton 
            active={activeTab === 'favorites'} 
            onClick={() => handleTabChange('favorites')}
          >
            ❤️ 즐겨찾기 ({favorites.length})
          </TabButton>
          <TabButton 
            active={activeTab === 'bucketlist'} 
            onClick={() => handleTabChange('bucketlist')}
          >
            📝 버킷리스트 ({bucketList.length})
          </TabButton>
        </TabContainer>
      </TabSection>

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
          <CurrentTab>{activeTab === 'favorites' ? '즐겨찾기' : '버킷리스트'}</CurrentTab>
          <ItemCount>{filteredItems.length}개 항목</ItemCount>
        </StatusInfo>
        {activeTab === 'bucketlist' && (
          <CompletionStats>
            완료: {bucketList.filter(item => item.completed).length} / 
            전체: {bucketList.length}
          </CompletionStats>
        )}
      </StatusSection>

      {/* 네이버 지도 섹션 */}
      <MapSection>
        <SectionTitle>🗺️ 홍대 지역 지도</SectionTitle>
        <MapDescription>
          즐겨찾기와 버킷리스트의 장소들이 위치한 홍대 지역을 확인해보세요
        </MapDescription>
        <NaverMap 
          width="100%" 
          height="300px" 
          center={{ lat: 37.5563, lng: 126.9244 }} 
        />
      </MapSection>

      {/* 아이템 그리드 */}
      <ItemGrid>
        {filteredItems.length === 0 ? (
          <EmptyState>
            <EmptyIcon>{activeTab === 'favorites' ? '💔' : '📝'}</EmptyIcon>
            <EmptyTitle>
              {activeTab === 'favorites' ? '즐겨찾기한 항목이 없습니다' : '버킷리스트가 비어있습니다'}
            </EmptyTitle>
            <EmptyDescription>
              {activeTab === 'favorites' 
                ? '관심있는 가게나 이벤트에 하트를 눌러보세요!' 
                : '가고 싶은 곳이나 하고 싶은 것을 추가해보세요!'
              }
            </EmptyDescription>
          </EmptyState>
        ) : (
          filteredItems.map((item) => (
            <ItemCard 
              key={item.id} 
              onClick={() => handleItemClick(item)}
              completed={item.completed}
            >
              <ItemImage>
                <img src={item.image} alt={item.name} />
                <ItemActions>
                  {activeTab === 'favorites' ? (
                    <ActionButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(item.id);
                      }}
                      color="#FF6B6B"
                    >
                      💔
                    </ActionButton>
                  ) : (
                    <>
                      <ActionButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBucketComplete(item.id);
                        }}
                        color="#10B981"
                      >
                        {item.completed ? '✅' : '⭕'}
                      </ActionButton>
                      <ActionButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBucketItem(item.id);
                        }}
                        color="#FF6B6B"
                      >
                        🗑️
                      </ActionButton>
                    </>
                  )}
                </ItemActions>
                <CategoryTag>{item.category}</CategoryTag>
                {item.priority && (
                  <PriorityBadge priority={item.priority}>
                    {item.priority === 'high' ? '🔥' : item.priority === 'medium' ? '⚡' : '📌'}
                  </PriorityBadge>
                )}
              </ItemImage>
              
              <ItemContent>
                <ItemTitle completed={item.completed}>{item.name}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
                
                <ItemInfo>
                  <InfoRow>
                    <InfoLabel>추가일:</InfoLabel>
                    <InfoValue>{item.addedDate}</InfoValue>
                  </InfoRow>
                  
                  {activeTab === 'favorites' && item.likeCount && (
                    <InfoRow>
                      <InfoLabel>좋아요:</InfoLabel>
                      <InfoValue>{item.likeCount}개</InfoValue>
                    </InfoRow>
                  )}
                  
                  {activeTab === 'favorites' && item.endDate && (
                    <InfoRow>
                      <InfoLabel>마감:</InfoLabel>
                      <InfoValue>{item.endDate}</InfoValue>
                    </InfoRow>
                  )}
                  
                  {activeTab === 'bucketlist' && item.targetDate && (
                    <InfoRow>
                      <InfoLabel>목표일:</InfoLabel>
                      <InfoValue>{item.targetDate}</InfoValue>
                    </InfoRow>
                  )}
                </ItemInfo>
              </ItemContent>
            </ItemCard>
          ))
        )}
      </ItemGrid>

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


const TabSection = styled.div`
  background-color: white;
  border-bottom: 1px solid #e9ecef;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const TabButton = styled.button`
  padding: 2rem 3rem;
  background-color: ${props => props.active ? '#FEE502' : 'transparent'};
  color: #262626;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#FEE502' : 'transparent'};
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#FEE502' : '#FFF9C4'};
  }
`;

const FilterSection = styled.div`
  background-color: white;
  padding: 1.5rem 0;
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
  background-color: ${props => props.active ? '#262626' : 'transparent'};
  color: ${props => props.active ? 'white' : '#262626'};
  border: 1px solid ${props => props.active ? '#262626' : '#E5E5E5'};
  border-radius: 20px;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #262626;
    background-color: ${props => props.active ? '#262626' : '#f8f9fa'};
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

const CompletionStats = styled.div`
  font-size: 1.4rem;
  color: #666;
  font-weight: 500;
  background-color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  border: 1px solid #e9ecef;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem 2rem;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
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

const ItemCard = styled.div`
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => props.completed ? 0.7 : 1};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
`;

const ItemImage = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor: pointer;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const CategoryTag = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 0.4rem 0.8rem;
  background-color: #FEE502;
  color: #262626;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
`;

const PriorityBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 2rem;
`;

const ItemContent = styled.div`
  padding: 1.5rem;
`;

const ItemTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 0.8rem 0;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.7 : 1};
`;

const ItemDescription = styled.p`
  font-size: 1.3rem;
  color: #666;
  margin: 0 0 1.2rem 0;
  line-height: 1.4;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: 1.2rem;
  color: #888;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 1.2rem;
  color: #262626;
  font-weight: 600;
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