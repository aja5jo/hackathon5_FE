import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';
import { categoriesAPI, favoritesAPI, mainAPI } from '../services/api';



function Lookmore() {
  const { category, itemId, itemType } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [itemData, setItemData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 타입을 대문자로 정규화
  const normalizedType = itemType?.toUpperCase() || 'STORE';
  
  // 카테고리 이름 정규화
  const normalizedCategory = category?.toUpperCase() || 'STORE';

  useEffect(() => {
    const loadItemData = async () => {
      setIsLoading(true);
      try {
        console.log('Lookmore API 호출:', { category: normalizedCategory, type: normalizedType, id: itemId });
        
        // ✅ 백엔드 API 호출 - API 명세서에 맞춤
        let result;
        
        if (normalizedType === 'STORE') {
          result = await mainAPI.getStoreDetail(itemId);
        } else if (normalizedType === 'EVENT') {
          result = await mainAPI.getEventDetail(itemId);
        } else if (normalizedType === 'POPUP') {
          result = await mainAPI.getPopupDetail(itemId);
        } else {
          throw new Error('지원하지 않는 타입입니다.');
        }
        
        console.log('Lookmore API 응답:', result);
        
                 if (result.success && result.data) {
           // ✅ 백엔드 DTO 구조에 맞춰 데이터 설정
           const data = result.data;
           
           // ✅ 비로그인 상태일 때 좋아요 순으로 정렬된 관련 아이템 표시
           const user = localStorage.getItem('user');
           if (!user) {
             console.log('Lookmore - 비로그인 상태: 좋아요 순 정렬 모드');
           }
           
           setItemData({
             ...data,
             type: normalizedType,
             category: normalizedCategory,
             // 백엔드에서 제공하지 않는 필드들은 기본값 설정
             images: data.images || [
               `https://picsum.photos/seed/${data.name}-1/400/300`,
               `https://picsum.photos/seed/${data.name}-2/400/300`,
               `https://picsum.photos/seed/${data.name}-3/400/300`,
               `https://picsum.photos/seed/${data.name}-4/400/300`
             ],
             reviews: data.reviews || [
               {
                 id: 1,
                 author: '김철수',
                 rating: 5,
                 content: `${data.name}에서 정말 좋은 시간을 보냈어요!`,
                 date: '2025-03-08'
               },
               {
                 id: 2,
                 author: '이영희',
                 rating: 4,
                 content: '분위기도 좋고 서비스도 훌륭해요.',
                 date: '2025-03-07'
               },
               {
                 id: 3,
                 author: '박민수',
                 rating: 5,
                 content: '다음에 또 방문하고 싶은 곳입니다.',
                 date: '2025-03-06'
               }
             ]
           });
           setIsLiked(data.liked || false);
           setLikeCount(data.likeCount || 0);
        } else {
          setError(result.message || '상세 정보를 불러올 수 없습니다.');
        }
        
      } catch (error) {
        console.error('Failed to load item data:', error);
        setError('서버 연결에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadItemData();
  }, [category, itemId, itemType, normalizedCategory, normalizedType]);

  const handleLikeToggle = async () => {
    try {
      console.log('좋아요 토글 시작:', { itemId, type: normalizedType, currentLike: isLiked });
      
      // ✅ 타입에 따른 적절한 API 호출
      let result;
      
      if (normalizedType === 'STORE') {
        result = await favoritesAPI.toggleStoreFavorite(itemId);
      } else if (normalizedType === 'EVENT') {
        result = await favoritesAPI.toggleEventFavorite(itemId);
      } else if (normalizedType === 'POPUP') {
        result = await favoritesAPI.togglePopupFavorite(itemId);
      } else {
        throw new Error('지원하지 않는 타입입니다.');
      }
      
      console.log('좋아요 토글 API 응답:', result);
      
      if (result.success && result.data) {
        // ✅ API 응답에 따라 상태 업데이트
        const newLiked = result.data.liked;
        const newLikeCount = result.data.likeCount;
        
        setIsLiked(newLiked);
        setLikeCount(newLikeCount);
        
        console.log('좋아요 상태 업데이트:', { liked: newLiked, likeCount: newLikeCount });
      } else {
        console.error('좋아요 토글 실패:', result.message);
      }
      
    } catch (error) {
      console.error('Failed to toggle like:', error);
      console.log('좋아요 처리에 실패했습니다.');
    }
  };

  const handleWriteReview = () => {
    // 리뷰 작성 페이지로 이동 (추후 구현)
    alert('리뷰 작성 기능은 추후 구현 예정입니다.');
  };

  if (isLoading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <LoadingText>로딩 중...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header />
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      </Container>
    );
  }

  if (!itemData) {
    return (
      <Container>
        <Header />
        <ErrorContainer>
          <ErrorText>상세 정보를 찾을 수 없습니다.</ErrorText>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      
      {/* 배너 섹션 */}
      <BannerSection>
        <BannerBackground>
          <BannerContent>
            <TypeBadge type={normalizedType}>
              {normalizedType === 'EVENT' ? '이벤트' : '가게'}
            </TypeBadge>
            <BannerTitle>{itemData.name}</BannerTitle>
            <BannerDate>
              {itemData.startDate && itemData.endDate 
                ? `${itemData.startDate} ~ ${itemData.endDate}`
                : normalizedType === 'EVENT' ? '상시 진행' : '상시 운영'
              }
            </BannerDate>
          </BannerContent>
        </BannerBackground>
      </BannerSection>

      {/* 메인 콘텐츠 */}
      <MainContent>
        {/* 사진 섹션 */}
        <PhotoSection>
          <PhotoTitle>{itemData.name} 관련 사진들</PhotoTitle>
          <PhotoGrid>
            {itemData.images.map((image, index) => (
              <PhotoItem key={index}>
                <PhotoImage src={image} alt={`${itemData.name} 이미지 ${index + 1}`} />
              </PhotoItem>
            ))}
          </PhotoGrid>
        </PhotoSection>

        {/* 리뷰 섹션 */}
        <ReviewSection>
          <ReviewTitle>리뷰</ReviewTitle>
          <ReviewList>
            {itemData.reviews.map((review) => (
              <ReviewItem key={review.id}>
                <ReviewHeader>
                  <ReviewAuthor>{review.author}</ReviewAuthor>
                  <ReviewRating>
                    {'⭐'.repeat(review.rating)}
                  </ReviewRating>
                  <ReviewDate>{review.date}</ReviewDate>
                </ReviewHeader>
                <ReviewContent>{review.content}</ReviewContent>
              </ReviewItem>
            ))}
          </ReviewList>
          
          {/* 리뷰 작성 버튼 */}
          <WriteReviewButton onClick={handleWriteReview}>
            내 리뷰 작성 (with 별점 제도)
          </WriteReviewButton>
        </ReviewSection>
      </MainContent>

      <Footer />
    </Container>
  );
}

export default Lookmore;

const Container = styled.div`
  width: 100%;
  background-color: #f8f9fa;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding-top: 64px;
`;

const LoadingText = styled.div`
  font-size: 1.8rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding-top: 64px;
`;

const ErrorText = styled.div`
  font-size: 1.8rem;
  color: #FF6B35;
`;

const BannerSection = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 64px;
  position: relative;
  overflow: hidden;
`;

const BannerBackground = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M0,50 Q25,40 50,50 T100,50" stroke="rgba(255,255,255,0.1)" fill="none" stroke-width="2"/><path d="M0,60 Q25,50 50,60 T100,60" stroke="rgba(255,255,255,0.05)" fill="none" stroke-width="2"/></pattern></defs><rect width="100" height="100" fill="url(%23waves)"/></svg>');
    opacity: 0.3;
  }
`;

const BannerContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 1;
`;

const BannerTitle = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const BannerDate = styled.div`
  font-size: 1.8rem;
  font-weight: 500;
  opacity: 0.9;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const PhotoSection = styled.section`
  margin-bottom: 4rem;
`;

const PhotoTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: #262626;
  margin-bottom: 2rem;
  text-align: center;
  padding: 2rem;
  background-color: #F5F5DC;
  border-radius: 12px;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const PhotoItem = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const ReviewSection = styled.section`
  background-color: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const ReviewTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 600;
  color: #262626;
  margin-bottom: 2rem;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ReviewItem = styled.div`
  padding: 2rem;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  background-color: #fafafa;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewAuthor = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: #262626;
`;

const ReviewRating = styled.div`
  font-size: 1.4rem;
`;

const ReviewDate = styled.div`
  font-size: 1.4rem;
  color: #666;
`;

const ReviewContent = styled.div`
  font-size: 1.6rem;
  color: #333;
  line-height: 1.6;
`;

const WriteReviewButton = styled.button`
  width: 100%;
  padding: 1.5rem;
  background-color: #FF6B35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #E55A2B;
  }
`;

const TypeBadge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  background-color: ${props => props.type === 'EVENT' ? '#FF6B35' : '#FEE502'};
  color: ${props => props.type === 'EVENT' ? 'white' : '#262626'};
  border-radius: 20px;
  font-size: 1.4rem;
  font-weight: 600;
  text-transform: uppercase;
`;
