import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import bannerImg from '../../assets/banner.png';

function UserHistory() {
  const navigate = useNavigate();
  const [visitHistory, setVisitHistory] = useState([]);
  const [filter, setFilter] = useState('all'); // all, thisMonth, thisYear

  useEffect(() => {
    // 더미 방문 기록 데이터
    const dummyHistory = [
      {
        id: 1,
        placeName: '홍대 팝업 스테이션',
        placeType: '팝업',
        visitDate: '2024-01-15',
        rating: 5,
        review: '정말 멋진 팝업이었어요!',
        image: 'https://picsum.photos/seed/visit1/300/200'
      },
      {
        id: 2,
        placeName: '홍대 카페 스팟',
        placeType: '카페',
        visitDate: '2024-01-10',
        rating: 4,
        review: '분위기가 좋았어요',
        image: 'https://picsum.photos/seed/visit2/300/200'
      },
      {
        id: 3,
        placeName: '홍대 맛집',
        placeType: '음식점',
        visitDate: '2024-01-05',
        rating: 5,
        review: '음식이 맛있었어요',
        image: 'https://picsum.photos/seed/visit3/300/200'
      },
      {
        id: 4,
        placeName: '홍대 전시회',
        placeType: '전시',
        visitDate: '2023-12-20',
        rating: 4,
        review: '흥미로운 전시였습니다',
        image: 'https://picsum.photos/seed/visit4/300/200'
      }
    ];
    setVisitHistory(dummyHistory);
  }, []);

  const filteredHistory = visitHistory.filter(visit => {
    const visitDate = new Date(visit.visitDate);
    const now = new Date();
    
    switch (filter) {
      case 'thisMonth':
        return visitDate.getMonth() === now.getMonth() && 
               visitDate.getFullYear() === now.getFullYear();
      case 'thisYear':
        return visitDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case '팝업': return '#FEE502';
      case '카페': return '#FF6B6B';
      case '음식점': return '#4ECDC4';
      case '전시': return '#45B7D1';
      default: return '#95A5A6';
    }
  };

  return (
    <Container>
      <Banner>
        <BannerTitle>방문 기록</BannerTitle>
        <BannerSubtitle>내가 방문한 장소들의 기록을 확인해보세요</BannerSubtitle>
      </Banner>

      <Content>
        <HeaderSection>
          <Title>방문 기록</Title>
          <FilterSection>
            <FilterButton 
              active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              전체
            </FilterButton>
            <FilterButton 
              active={filter === 'thisMonth'} 
              onClick={() => setFilter('thisMonth')}
            >
              이번 달
            </FilterButton>
            <FilterButton 
              active={filter === 'thisYear'} 
              onClick={() => setFilter('thisYear')}
            >
              올해
            </FilterButton>
          </FilterSection>
        </HeaderSection>

        <StatsSection>
          <StatCard>
            <StatNumber>{filteredHistory.length}</StatNumber>
            <StatLabel>방문 횟수</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>
              {filteredHistory.length > 0 
                ? (filteredHistory.reduce((sum, visit) => sum + visit.rating, 0) / filteredHistory.length).toFixed(1)
                : 0
              }
            </StatNumber>
            <StatLabel>평균 평점</StatLabel>
          </StatCard>
        </StatsSection>

        <HistoryList>
          {filteredHistory.map((visit) => (
            <HistoryCard key={visit.id}>
              <CardImage src={visit.image} alt={visit.placeName} />
              <CardContent>
                <CardHeader>
                  <PlaceInfo>
                    <PlaceName>{visit.placeName}</PlaceName>
                    <PlaceType style={{ backgroundColor: getTypeColor(visit.placeType) }}>
                      {visit.placeType}
                    </PlaceType>
                  </PlaceInfo>
                  <VisitDate>{formatDate(visit.visitDate)}</VisitDate>
                </CardHeader>
                
                <RatingSection>
                  <RatingStars>{renderStars(visit.rating)}</RatingStars>
                  <RatingText>{visit.rating}/5</RatingText>
                </RatingSection>
                
                <ReviewText>{visit.review}</ReviewText>
                
                <ActionButtons>
                  <DetailButton onClick={() => navigate('/')}>
                    상세보기
                  </DetailButton>
                  <ReviewButton onClick={() => navigate('/mypage/reviews')}>
                    리뷰 작성
                  </ReviewButton>
                </ActionButtons>
              </CardContent>
            </HistoryCard>
          ))}
        </HistoryList>

        {filteredHistory.length === 0 && (
          <EmptyState>
            <EmptyIcon>📍</EmptyIcon>
            <EmptyTitle>방문 기록이 없어요</EmptyTitle>
            <EmptyDesc>홍대의 멋진 장소들을 방문해보세요!</EmptyDesc>
            <ExploreButton onClick={() => navigate('/')}>
              장소 둘러보기
            </ExploreButton>
          </EmptyState>
        )}
      </Content>

      <Footer />
    </Container>
  );
}

export default UserHistory;

// ===== styled =====
const Container = styled.div`
  min-height: 100vh;
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  color: #262626;
  margin: 0;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? '#FEE502' : 'transparent'};
  color: ${props => props.active ? '#262626' : '#666'};
  border: 2px solid ${props => props.active ? '#FEE502' : '#E5E5E5'};
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#ffe95a' : '#f8f9fa'};
  }
`;

const StatsSection = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StatCard = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  flex: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #FEE502;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.4rem;
  color: #666;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const HistoryCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CardImage = styled.img`
  width: 200px;
  height: 150px;
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const CardContent = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const PlaceInfo = styled.div`
  flex: 1;
`;

const PlaceName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 0.5rem 0;
`;

const PlaceType = styled.span`
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const VisitDate = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RatingStars = styled.div`
  font-size: 1.6rem;
  color: #FEE502;
  letter-spacing: 2px;
`;

const RatingText = styled.span`
  font-size: 1.4rem;
  color: #666;
`;

const ReviewText = styled.p`
  font-size: 1.4rem;
  color: #333;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
  flex: 1;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
`;

const DetailButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ffe95a;
  }
`;

const ReviewButton = styled.button`
  background: transparent;
  color: #666;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #FEE502;
    color: #262626;
    background: #FFF9C4;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 6rem;
  margin-bottom: 2rem;
`;

const EmptyTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 1rem 0;
`;

const EmptyDesc = styled.p`
  font-size: 1.6rem;
  color: #666;
  margin: 0 0 2rem 0;
`;

const ExploreButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 10px;
  padding: 1.2rem 2.5rem;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ffe95a;
    transform: translateY(-2px);
  }
`;
