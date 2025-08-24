import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';
import { storesAPI, isMerchant } from '../services/api';


function StoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  

  const [storeDetail, setStoreDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMerchantUser, setIsMerchantUser] = useState(false);

  useEffect(() => {
    fetchStoreDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // 사용자 타입 확인
    setIsMerchantUser(isMerchant());
  }, []);

  const fetchStoreDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await storesAPI.getStoreDetail(id);
      
      if (result.success) {
        const data = result.data;
        setStoreDetail(data);
        setLiked(Boolean(data.liked));
        setLikeCount(Number(data.likeCount || 0));
      } else {
        setError(result.message || '가게 정보를 불러오는데 실패했습니다.');
      }
      
    } catch (e) {
      console.error('가게 정보 로드 실패:', e);
      setError('가게 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    // 소상공인은 좋아요 기능 사용 불가
    if (isMerchantUser) {
      console.log('소상공인은 좋아요 기능을 사용할 수 없습니다.');
      return;
    }
    
    if (!isAuthenticated) {
      console.log('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    
    try {
      const result = await storesAPI.toggleStoreLike(id);
      
      if (result.success) {
        setLiked((prev) => !prev);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      } else {
        console.log(result.message || '좋아요 처리에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      console.log('좋아요 처리에 실패했습니다.');
    }
  };

  const handlePrevImage = () => {
    if (!storeDetail?.images?.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? storeDetail.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!storeDetail?.images?.length) return;
    setCurrentImageIndex((prev) => (prev === storeDetail.images.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <LoadingText>가게 정보를 불러오는 중...</LoadingText>
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

  if (!storeDetail) {
    return (
      <Container>
        <Header />
        <ErrorContainer>
          <ErrorText>가게를 찾을 수 없습니다.</ErrorText>
          <BackButton onClick={() => navigate(-1)}>돌아가기</BackButton>
        </ErrorContainer>
        <Footer />
      </Container>
    );
  }

  const mainImage = storeDetail.images?.[currentImageIndex] || storeDetail.thumbnail;

  return (
    <Container>
      <Header />

      <MainContent>
        {/* 이미지 섹션 */}
        <ImageSection>
          <ImageContainer>
            <MainImage src={mainImage} alt={storeDetail.name} />
            {storeDetail.images && storeDetail.images.length > 1 && (
              <>
                <ImageNavButton left onClick={handlePrevImage}>◀</ImageNavButton>
                <ImageNavButton right onClick={handleNextImage}>▶</ImageNavButton>
                <ImageIndicators>
                  {storeDetail.images.map((_, index) => (
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

        {/* 정보 섹션 */}
        <InfoSection>
          <HeaderRow>
            <Title>{storeDetail.name}</Title>
            <LikeContainer>
              <LikeButton 
                onClick={handleLikeToggle} 
                liked={liked}
                disabled={isMerchantUser}
                style={{
                  opacity: isMerchantUser ? 0.5 : 1,
                  cursor: isMerchantUser ? 'not-allowed' : 'pointer'
                }}
              >
                {liked ? '❤️' : '🤍'}
              </LikeButton>
              <LikeCount>{likeCount}</LikeCount>
            </LikeContainer>
          </HeaderRow>

          <Description>{storeDetail.description}</Description>
          <Intro>{storeDetail.intro}</Intro>

          <Details>
            <DetailRow>
              <DetailLabel>📍 주소</DetailLabel>
              <DetailValue>{storeDetail.address}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>☎ 전화</DetailLabel>
              <DetailValue>{storeDetail.phone}</DetailValue>
            </DetailRow>
          </Details>

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

export default StoreDetail;

// ===== styles (EventDetail과 동일 레이아웃) =====
const Container = styled.div`
  width: 100%;
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

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
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

const Description = styled.p`
  font-size: 2rem;
  color: #444;
  font-weight: 600;
  margin: 0 0 2rem 0;
`;

const Intro = styled.p`
  font-size: 1.6rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 3rem 0;
`;

const Details = styled.div`
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