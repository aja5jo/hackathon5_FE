import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import bannerImg from '../../assets/banner.png';

function UserReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // 더미 리뷰 데이터
    const dummyReviews = [
      {
        id: 1,
        placeName: '홍대 팝업 스테이션',
        rating: 5,
        content: '정말 멋진 팝업이었어요! 디자인도 예쁘고 사진도 잘 나왔습니다.',
        date: '2024-01-15',
        images: ['https://picsum.photos/seed/review1/200/200']
      },
      {
        id: 2,
        placeName: '홍대 카페 스팟',
        rating: 4,
        content: '분위기가 좋고 커피도 맛있었어요. 다음에 또 방문하고 싶습니다.',
        date: '2024-01-10',
        images: []
      },
      {
        id: 3,
        placeName: '홍대 맛집',
        rating: 5,
        content: '음식이 정말 맛있었어요! 특히 파스타가 인상적이었습니다.',
        date: '2024-01-05',
        images: ['https://picsum.photos/seed/review3/200/200', 'https://picsum.photos/seed/review3-2/200/200']
      }
    ];
    setReviews(dummyReviews);
  }, []);

  const handleEditReview = (reviewId) => {
    alert(`리뷰 ${reviewId} 수정 기능은 준비 중입니다.`);
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      setReviews(reviews.filter(review => review.id !== reviewId));
      alert('리뷰가 삭제되었습니다.');
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <Container>
      <Banner>
        <BannerTitle>내 리뷰</BannerTitle>
        <BannerSubtitle>내가 작성한 리뷰들을 확인해보세요</BannerSubtitle>
      </Banner>

      <Content>
        <HeaderSection>
          <Title>내 리뷰 목록</Title>
          <ReviewCount>총 {reviews.length}개의 리뷰</ReviewCount>
        </HeaderSection>

        <ReviewList>
          {reviews.map((review) => (
            <ReviewCard key={review.id}>
              <ReviewHeader>
                <PlaceInfo>
                  <PlaceName>{review.placeName}</PlaceName>
                  <ReviewDate>{review.date}</ReviewDate>
                </PlaceInfo>
                <RatingStars>{renderStars(review.rating)}</RatingStars>
              </ReviewHeader>
              
              <ReviewContent>{review.content}</ReviewContent>
              
              {review.images.length > 0 && (
                <ImageSection>
                  {review.images.map((image, index) => (
                    <ReviewImage key={index} src={image} alt={`리뷰 이미지 ${index + 1}`} />
                  ))}
                </ImageSection>
              )}
              
              <ActionButtons>
                <EditButton onClick={() => handleEditReview(review.id)}>
                  수정
                </EditButton>
                <DeleteButton onClick={() => handleDeleteReview(review.id)}>
                  삭제
                </DeleteButton>
              </ActionButtons>
            </ReviewCard>
          ))}
        </ReviewList>

        {reviews.length === 0 && (
          <EmptyState>
            <EmptyIcon>📝</EmptyIcon>
            <EmptyTitle>아직 작성한 리뷰가 없어요</EmptyTitle>
            <EmptyDesc>방문한 장소에 대한 리뷰를 작성해보세요!</EmptyDesc>
            <WriteButton onClick={() => navigate('/')}>
              리뷰 작성하러 가기
            </WriteButton>
          </EmptyState>
        )}
      </Content>

      <Footer />
    </Container>
  );
}

export default UserReviews;

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
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  color: #262626;
  margin: 0;
`;

const ReviewCount = styled.span`
  font-size: 1.6rem;
  color: #666;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ReviewCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
`;

const ReviewHeader = styled.div`
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

const ReviewDate = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0;
`;

const RatingStars = styled.div`
  font-size: 1.8rem;
  color: #FEE502;
  letter-spacing: 2px;
`;

const ReviewContent = styled.p`
  font-size: 1.6rem;
  color: #333;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
`;

const ImageSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const ReviewImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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

const WriteButton = styled.button`
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
