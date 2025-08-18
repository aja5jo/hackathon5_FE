import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import bannerImg from '../../assets/banner.png';

function UserRatings() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [filter, setFilter] = useState('all'); // all, 5star, 4star, 3star, 2star, 1star

  useEffect(() => {
    // 더미 평점 데이터
    const dummyRatings = [
      {
        id: 1,
        placeName: '홍대 팝업 스테이션',
        placeType: '팝업',
        rating: 5,
        review: '정말 멋진 팝업이었어요!',
        date: '2024-01-15',
        image: 'https://picsum.photos/seed/rating1/200/200'
      },
      {
        id: 2,
        placeName: '홍대 카페 스팟',
        placeType: '카페',
        rating: 4,
        review: '분위기가 좋고 커피도 맛있었어요.',
        date: '2024-01-10',
        image: 'https://picsum.photos/seed/rating2/200/200'
      },
      {
        id: 3,
        placeName: '홍대 맛집',
        placeType: '음식점',
        rating: 5,
        review: '음식이 정말 맛있었어요!',
        date: '2024-01-05',
        image: 'https://picsum.photos/seed/rating3/200/200'
      },
      {
        id: 4,
        placeName: '홍대 전시회',
        placeType: '전시',
        rating: 3,
        review: '괜찮았지만 기대했던 것보다는 아쉬웠어요.',
        date: '2023-12-20',
        image: 'https://picsum.photos/seed/rating4/200/200'
      }
    ];
    setRatings(dummyRatings);
  }, []);

  const filteredRatings = ratings.filter(rating => {
    if (filter === 'all') return true;
    return rating.rating === parseInt(filter);
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

  const getRatingColor = (rating) => {
    switch (rating) {
      case 5: return '#28a745';
      case 4: return '#17a2b8';
      case 3: return '#ffc107';
      case 2: return '#fd7e14';
      case 1: return '#dc3545';
      default: return '#6c757d';
    }
  };

  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
    : 0;

  const ratingDistribution = {
    5: ratings.filter(r => r.rating === 5).length,
    4: ratings.filter(r => r.rating === 4).length,
    3: ratings.filter(r => r.rating === 3).length,
    2: ratings.filter(r => r.rating === 2).length,
    1: ratings.filter(r => r.rating === 1).length
  };

  return (
    <Container>
      <Banner>
        <BannerTitle>내 평점</BannerTitle>
        <BannerSubtitle>내가 매긴 평점들을 확인해보세요</BannerSubtitle>
      </Banner>

      <Content>
        <HeaderSection>
          <Title>내 평점 목록</Title>
          <FilterSection>
            <FilterButton 
              active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              전체
            </FilterButton>
            <FilterButton 
              active={filter === '5'} 
              onClick={() => setFilter('5')}
            >
              5점
            </FilterButton>
            <FilterButton 
              active={filter === '4'} 
              onClick={() => setFilter('4')}
            >
              4점
            </FilterButton>
            <FilterButton 
              active={filter === '3'} 
              onClick={() => setFilter('3')}
            >
              3점
            </FilterButton>
            <FilterButton 
              active={filter === '2'} 
              onClick={() => setFilter('2')}
            >
              2점
            </FilterButton>
            <FilterButton 
              active={filter === '1'} 
              onClick={() => setFilter('1')}
            >
              1점
            </FilterButton>
          </FilterSection>
        </HeaderSection>

        <StatsSection>
          <StatCard>
            <StatNumber>{ratings.length}</StatNumber>
            <StatLabel>총 평점 수</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber style={{ color: getRatingColor(Math.round(averageRating)) }}>
              {averageRating}
            </StatNumber>
            <StatLabel>평균 평점</StatLabel>
          </StatCard>
        </StatsSection>

        <DistributionSection>
          <DistributionTitle>평점 분포</DistributionTitle>
          <DistributionBars>
            {[5, 4, 3, 2, 1].map(star => (
              <DistributionBar key={star}>
                <BarLabel>{star}점</BarLabel>
                <BarContainer>
                  <Bar 
                    width={(ratingDistribution[star] / ratings.length) * 100} 
                    color={getRatingColor(star)}
                  />
                </BarContainer>
                <BarCount>{ratingDistribution[star]}</BarCount>
              </DistributionBar>
            ))}
          </DistributionBars>
        </DistributionSection>

        <RatingList>
          {filteredRatings.map((rating) => (
            <RatingCard key={rating.id}>
              <CardImage src={rating.image} alt={rating.placeName} />
              <CardContent>
                <CardHeader>
                  <PlaceInfo>
                    <PlaceName>{rating.placeName}</PlaceName>
                    <PlaceType style={{ backgroundColor: getTypeColor(rating.placeType) }}>
                      {rating.placeType}
                    </PlaceType>
                  </PlaceInfo>
                  <RatingDate>{formatDate(rating.date)}</RatingDate>
                </CardHeader>
                
                <RatingSection>
                  <RatingStars style={{ color: getRatingColor(rating.rating) }}>
                    {renderStars(rating.rating)}
                  </RatingStars>
                  <RatingText style={{ color: getRatingColor(rating.rating) }}>
                    {rating.rating}/5
                  </RatingText>
                </RatingSection>
                
                <ReviewText>{rating.review}</ReviewText>
                
                <ActionButtons>
                  <EditButton onClick={() => navigate('/mypage/reviews')}>
                    수정
                  </EditButton>
                  <DeleteButton onClick={() => {
                    if (window.confirm('이 평점을 삭제하시겠습니까?')) {
                      setRatings(ratings.filter(r => r.id !== rating.id));
                      alert('평점이 삭제되었습니다.');
                    }
                  }}>
                    삭제
                  </DeleteButton>
                </ActionButtons>
              </CardContent>
            </RatingCard>
          ))}
        </RatingList>

        {filteredRatings.length === 0 && (
          <EmptyState>
            <EmptyIcon>⭐</EmptyIcon>
            <EmptyTitle>평점이 없어요</EmptyTitle>
            <EmptyDesc>방문한 장소에 대한 평점을 매겨보세요!</EmptyDesc>
            <RateButton onClick={() => navigate('/')}>
              평점 매기러 가기
            </RateButton>
          </EmptyState>
        )}
      </Content>

      <Footer />
    </Container>
  );
}

export default UserRatings;

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
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? '#FEE502' : 'transparent'};
  color: ${props => props.active ? '#262626' : '#666'};
  border: 2px solid ${props => props.active ? '#FEE502' : '#E5E5E5'};
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 1.2rem;
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

const DistributionSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
`;

const DistributionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 1.5rem 0;
`;

const DistributionBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DistributionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BarLabel = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: #262626;
  min-width: 40px;
`;

const BarContainer = styled.div`
  flex: 1;
  height: 20px;
  background: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
`;

const Bar = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background: ${props => props.color};
  border-radius: 10px;
  transition: width 0.3s ease;
`;

const BarCount = styled.span`
  font-size: 1.2rem;
  color: #666;
  min-width: 30px;
  text-align: right;
`;

const RatingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RatingCard = styled.div`
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

const RatingDate = styled.p`
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
  letter-spacing: 2px;
`;

const RatingText = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
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

const EditButton = styled.button`
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

const DeleteButton = styled.button`
  background: transparent;
  color: #dc3545;
  border: 2px solid #dc3545;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #dc3545;
    color: white;
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

const RateButton = styled.button`
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
