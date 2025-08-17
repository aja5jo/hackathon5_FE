import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

function PopupDetail() {
  const { popupId } = useParams();
  const navigate = useNavigate();

  const [popupDetail, setPopupDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 더미 팝업 상세 (응답 예시를 반영)
  const dummyPopupDetail = {
    id: 17,
    userId: 5,
    category: 'K_POP',
    name: '뉴진스 팝업',
    description: '앨범 굿즈 한정 판매',
    intro: '한 줄 소개',
    thumbnail: 'https://picsum.photos/seed/popup-thumb-17/800/400',
    images: [
      'https://picsum.photos/seed/popup17-1/800/400',
      'https://picsum.photos/seed/popup17-2/800/400',
    ],
    startDate: '2025-08-01',
    endDate: '2025-08-14',
    startTime: '10:00:00',
    endTime: '20:00:00',
    address: '서울시 강남구 테헤란로 123',
    likeCount: 123,
    liked: true,
  };

  useEffect(() => {
    fetchPopupDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupId]);

  const fetchPopupDetail = async () => {
    setIsLoading(true);
    try {
      // 더미 데이터 시뮬레이션
      setTimeout(() => {
        const data = dummyPopupDetail;
        setPopupDetail(data);
        setLiked(Boolean(data.liked));
        setLikeCount(Number(data.likeCount || 0));
        setIsLoading(false);
      }, 600);

      // 실제 API 연결 시 주석 해제
      /*
      const res = await fetch(`/api/popups/${popupId}`);
      const json = await res.json();
      if (json?.success) {
        const data = json.data;
        setPopupDetail(data);
        setLiked(Boolean(data.liked));
        setLikeCount(Number(data.likeCount || 0));
      } else {
        setError(json?.message || '팝업 정보를 불러오는데 실패했습니다.');
      }
      setIsLoading(false);
      */
    } catch (e) {
      setError('팝업 정보를 불러오는데 실패했습니다.');
      setIsLoading(false);
    }
  };

  const handleLikeToggle = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    // TODO: 좋아요 API 연동
  };

  const handlePrevImage = () => {
    if (!popupDetail?.images?.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? popupDetail.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!popupDetail?.images?.length) return;
    setCurrentImageIndex((prev) => (prev === popupDetail.images.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <LoadingText>팝업 정보를 불러오는 중...</LoadingText>
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

  if (!popupDetail) {
    return (
      <Container>
        <Header />
        <ErrorContainer>
          <ErrorText>팝업을 찾을 수 없습니다.</ErrorText>
          <BackButton onClick={() => navigate(-1)}>돌아가기</BackButton>
        </ErrorContainer>
        <Footer />
      </Container>
    );
  }

  const mainImage = popupDetail.images?.[currentImageIndex] || popupDetail.thumbnail;

  return (
    <Container>
      <Header />
      <MainContent>
        {/* 이미지 섹션 */}
        <ImageSection>
          <ImageContainer>
            <MainImage src={mainImage} alt={popupDetail.name} />
            {popupDetail.images && popupDetail.images.length > 1 && (
              <>
                <ImageNavButton left onClick={handlePrevImage}>◀</ImageNavButton>
                <ImageNavButton right onClick={handleNextImage}>▶</ImageNavButton>
                <ImageIndicators>
                  {popupDetail.images.map((_, idx) => (
                    <Indicator
                      key={idx}
                      active={idx === currentImageIndex}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </ImageIndicators>
              </>
            )}
          </ImageContainer>
        </ImageSection>

        {/* 정보 섹션 */}
        <InfoSection>
          <PopupHeader>
            <PopupTitle>{popupDetail.name}</PopupTitle>
            <LikeContainer>
              <LikeButton onClick={handleLikeToggle} liked={liked}>
                {liked ? '❤️' : '🤍'}
              </LikeButton>
              <LikeCount>{likeCount}</LikeCount>
            </LikeContainer>
          </PopupHeader>

          <PopupDescription>{popupDetail.description}</PopupDescription>
          <PopupIntro>{popupDetail.intro}</PopupIntro>

          <PopupDetails>
            <DetailRow>
              <DetailLabel>📅 기간</DetailLabel>
              <DetailValue>
                {popupDetail.startDate} ~ {popupDetail.endDate}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>🕐 시간</DetailLabel>
              <DetailValue>
                {popupDetail.startTime} ~ {popupDetail.endTime}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>📍 위치</DetailLabel>
              <DetailValue>{popupDetail.address}</DetailValue>
            </DetailRow>
          </PopupDetails>

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

export default PopupDetail;

// ===== styles (EventDetail과 유사) =====
const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  //margin-top: 64px;
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
  ${props => (props.left ? 'left: 1rem;' : 'right: 1rem;')}
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
  background-color: ${props => (props.active ? 'white' : 'rgba(255, 255, 255, 0.5)')};
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const InfoSection = styled.section`
  background-color: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const PopupTitle = styled.h1`
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

const PopupDescription = styled.p`
  font-size: 2rem;
  color: #444;
  font-weight: 600;
  margin: 0 0 2rem 0;
`;

const PopupIntro = styled.p`
  font-size: 1.6rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 3rem 0;
`;

const PopupDetails = styled.div`
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