import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventDetail, setEventDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 더미 이벤트 상세 데이터
  const dummyEventDetail = {
    id: 10,
    name: "여름 한정 아이스 아메리카노 1+1",
    description: "무더운 여름을 시원하게!",
    intro: "여름 시즌을 맞이하여 아이스 음료 1+1 이벤트를 진행합니다. 참여 매장에서만 가능하며, 소진 시 종료됩니다.",
    thumbnail: "https://picsum.photos/seed/event10/800/400",
    images: [
      "https://picsum.photos/seed/event10-1/800/400",
      "https://picsum.photos/seed/event10-2/800/400",
      "https://picsum.photos/seed/event10-3/800/400"
    ],
    startDate: "2025-08-10",
    endDate: "2025-08-20",
    startTime: "10:00:00",
    endTime: "22:00:00",
    likeCount: 156,
    liked: false,
    store: {
      storeId: 3,
      storeName: "홍카페",
      address: "서울 마포구 서교동 123-45",
      phone: "02-1234-5678",
      storeImageUrl: "https://picsum.photos/seed/store3/300/200"
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [eventId]);

  const fetchEventDetail = async () => {
    setIsLoading(true);
    try {
      // 더미 데이터로 시뮬레이션
      setTimeout(() => {
        setEventDetail(dummyEventDetail);
        setLiked(dummyEventDetail.liked);
        setLikeCount(dummyEventDetail.likeCount);
        setIsLoading(false);
      }, 1000);

      // 실제 API 호출 (백엔드 연결 시 주석 해제)
      /*
      const response = await fetch(`/api/events/${eventId}`);
      const result = await response.json();
      
      if (result.success) {
        setEventDetail(result.data);
        setLiked(result.data.liked);
        setLikeCount(result.data.likeCount);
      } else {
        setError(result.message);
      }
      setIsLoading(false);
      */
    } catch (err) {
      setError('이벤트 정보를 불러오는데 실패했습니다.');
      setIsLoading(false);
    }
  };

  const handleLikeToggle = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    // 실제 좋아요 API 호출 로직 추가
  };

  const handleStoreClick = () => {
    if (eventDetail?.store) {
      navigate(`/store/${eventDetail.store.storeId}`);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? eventDetail.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === eventDetail.images.length - 1 ? 0 : prev + 1
    );
  };

  if (isLoading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <LoadingText>이벤트 정보를 불러오는 중...</LoadingText>
        </LoadingContainer>
        <Footer />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header />
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <BackButton onClick={() => navigate(-1)}>돌아가기</BackButton>
        </ErrorContainer>
        <Footer />
      </Container>
    );
  }

  if (!eventDetail) {
    return (
      <Container>
        <Header />
        <ErrorContainer>
          <ErrorText>이벤트를 찾을 수 없습니다.</ErrorText>
          <BackButton onClick={() => navigate(-1)}>돌아가기</BackButton>
        </ErrorContainer>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      
      <MainContent>
        {/* 이벤트 이미지 섹션 */}
        <ImageSection>
          <ImageContainer>
            <MainImage 
              src={eventDetail.images?.[currentImageIndex] || eventDetail.thumbnail} 
              alt={eventDetail.name}
            />
            {eventDetail.images && eventDetail.images.length > 1 && (
              <>
                <ImageNavButton left onClick={handlePrevImage}>
                  ◀
                </ImageNavButton>
                <ImageNavButton right onClick={handleNextImage}>
                  ▶
                </ImageNavButton>
                <ImageIndicators>
                  {eventDetail.images.map((_, index) => (
                    <Indicator 
                      key={index}
                      active={index === currentImageIndex}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </ImageIndicators>
              </>
            )}
          </ImageContainer>
        </ImageSection>

        {/* 이벤트 정보 섹션 */}
        <InfoSection>
          <EventHeader>
            <EventTitle>{eventDetail.name}</EventTitle>
            <LikeContainer>
              <LikeButton onClick={handleLikeToggle} liked={liked}>
                {liked ? '❤️' : '🤍'}
              </LikeButton>
              <LikeCount>{likeCount}</LikeCount>
            </LikeContainer>
          </EventHeader>

          <EventDescription>{eventDetail.description}</EventDescription>
          
          <EventIntro>{eventDetail.intro}</EventIntro>

          <EventDetails>
            <DetailRow>
              <DetailLabel>📅 기간</DetailLabel>
              <DetailValue>
                {eventDetail.startDate} ~ {eventDetail.endDate}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>🕐 시간</DetailLabel>
              <DetailValue>
                {eventDetail.startTime} ~ {eventDetail.endTime}
              </DetailValue>
            </DetailRow>
          </EventDetails>

          {/* 매장 정보 섹션 */}
          {eventDetail.store && (
            <StoreSection>
              <SectionTitle>매장 정보</SectionTitle>
              <StoreCard onClick={handleStoreClick}>
                <StoreImage>
                  <img src={eventDetail.store.storeImageUrl} alt={eventDetail.store.storeName} />
                </StoreImage>
                <StoreInfo>
                  <StoreName>{eventDetail.store.storeName}</StoreName>
                  <StoreAddress>{eventDetail.store.address}</StoreAddress>
                  <StorePhone>{eventDetail.store.phone}</StorePhone>
                </StoreInfo>
                <StoreArrow>▶</StoreArrow>
              </StoreCard>
            </StoreSection>
          )}

          <ActionButtons>
            <ShareButton>공유하기</ShareButton>
            <BookmarkButton>즐겨찾기 추가</BookmarkButton>
          </ActionButtons>
        </InfoSection>
      </MainContent>

      <Footer />
    </Container>
  );
}

export default EventDetail;

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: 64px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const LoadingText = styled.div`
  font-size: 1.8rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  gap: 2rem;
`;

const ErrorText = styled.div`
  font-size: 1.8rem;
  color: #666;
  text-align: center;
`;

const BackButton = styled.button`
  padding: 1rem 2rem;
  background-color: #FEE502;
  color: #262626;
  border: none;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #E6CF00;
  }
`;

const ImageSection = styled.section`
  margin-bottom: 3rem;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.left ? 'left: 1rem;' : 'right: 1rem;'}
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const ImageIndicators = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
`;

const Indicator = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const InfoSection = styled.section`
  background-color: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const EventTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #262626;
  margin: 0;
  flex: 1;
`;

const LikeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  font-size: 2.4rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const LikeCount = styled.span`
  font-size: 1.4rem;
  color: #666;
  font-weight: 500;
`;

const EventDescription = styled.p`
  font-size: 2rem;
  color: #444;
  font-weight: 600;
  margin: 0 0 2rem 0;
`;

const EventIntro = styled.p`
  font-size: 1.6rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 3rem 0;
`;

const EventDetails = styled.div`
  margin-bottom: 3rem;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const DetailLabel = styled.span`
  font-size: 1.4rem;
  color: #888;
  min-width: 80px;
`;

const DetailValue = styled.span`
  font-size: 1.4rem;
  color: #262626;
  font-weight: 500;
`;

const StoreSection = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #262626;
  margin: 0 0 1.5rem 0;
`;

const StoreCard = styled.div`
  display: flex;
  align-items: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
  }
`;

const StoreImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 1.5rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StoreInfo = styled.div`
  flex: 1;
`;

const StoreName = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #262626;
  margin: 0 0 0.5rem 0;
`;

const StoreAddress = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 0.3rem 0;
`;

const StorePhone = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0;
`;

const StoreArrow = styled.div`
  font-size: 1.6rem;
  color: #999;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const ShareButton = styled.button`
  flex: 1;
  padding: 1.5rem;
  background-color: #e9ecef;
  color: #495057;
  border: none;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #dee2e6;
  }
`;

const BookmarkButton = styled.button`
  flex: 1;
  padding: 1.5rem;
  background-color: #FEE502;
  color: #262626;
  border: none;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #E6CF00;
  }
`;