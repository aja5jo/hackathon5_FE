import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import dummyEvents from '../assets/dummy.json';

function Lookmore() {
  const { category, itemId, itemType } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 타입을 대문자로 정규화
  const normalizedType = itemType?.toUpperCase() || 'STORE';
  
  // 카테고리 이름 매핑 (더미데이터의 실제 카테고리명과 매칭)
  const categoryMapping = {
    'K_POP': 'K_POP',  // 더미데이터에서는 'K_POP'으로 되어 있음
    'KPOP': 'K_POP',
    'CAFE': 'CAFE',
    'FOOD': 'FOOD',
    'SHOPPING': 'SHOPPING',
    'ENTERTAINMENT': 'ENTERTAINMENT',
    'CLUB': 'CLUB',
    'ETC': 'ETC'
  };
  
  const normalizedCategory = categoryMapping[category] || category;

  // ===== 더미데이터에서 실제 아이템 찾기 =====
  const findItemInDummy = (id, type, category) => {
    const targetId = parseInt(id);
    console.log('찾는 아이템 정보:', { id: targetId, type, category, normalizedCategory });
    
    // 모든 카테고리에서 검색 (카테고리 매칭 실패 시에도 아이템을 찾을 수 있도록)
    for (const categoryData of dummyEvents.categories) {
      console.log('검색 중인 카테고리:', categoryData.category);
      
      // 카테고리 매칭 확인
      const isCategoryMatch = categoryData.category === category || 
                             categoryData.category === normalizedCategory ||
                             categoryData.category === categoryMapping[category];
      
      if (isCategoryMatch) {
        console.log('카테고리 매칭 성공:', categoryData.category);
      }
      
      // stores에서 찾기 (소문자 'store'도 처리)
      if (type === 'STORE' || type === 'store') {
        console.log('stores 검색 중:', categoryData.stores);
        const store = categoryData.stores.find(store => store.id === targetId);
        if (store) {
          console.log('store 찾음:', store);
          return {
            ...store,
            type: 'STORE',
            category: categoryData.category,
            description: `${store.name}에서 특별한 경험을 즐겨보세요!`,
            startDate: null,
            endDate: null,
            images: [
              `https://picsum.photos/seed/${store.name}-1/400/300`,
              `https://picsum.photos/seed/${store.name}-2/400/300`,
              `https://picsum.photos/seed/${store.name}-3/400/300`,
              `https://picsum.photos/seed/${store.name}-4/400/300`
            ],
            reviews: [
              {
                id: 1,
                author: '김철수',
                rating: 5,
                content: `${store.name}에서 정말 좋은 시간을 보냈어요!`,
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
          };
        }
      }
      
      // events에서 찾기 (소문자 'event'도 처리)
      if (type === 'EVENT' || type === 'event') {
        console.log('events 검색 중:', categoryData.events);
        const event = categoryData.events.find(event => event.id === targetId);
        if (event) {
          console.log('event 찾음:', event);
          return {
            ...event,
            type: 'EVENT',
            category: categoryData.category,
            description: event.desc || `${event.name}에 참여해보세요!`,
            images: [
              `https://picsum.photos/seed/${event.name}-1/400/300`,
              `https://picsum.photos/seed/${event.name}-2/400/300`,
              `https://picsum.photos/seed/${event.name}-3/400/300`,
              `https://picsum.photos/seed/${event.name}-4/400/300`
            ],
            reviews: [
              {
                id: 1,
                author: '김철수',
                rating: 5,
                content: `${event.name} 정말 재미있었어요!`,
                date: '2025-03-08'
              },
              {
                id: 2,
                author: '이영희',
                rating: 4,
                content: '좋은 이벤트였습니다. 추천해요!',
                date: '2025-03-07'
              },
              {
                id: 3,
                author: '박민수',
                rating: 5,
                content: '다음 이벤트도 기대됩니다.',
                date: '2025-03-06'
              }
            ]
          };
        }
      }
    }
    
    console.log('아이템을 찾을 수 없음');
    // 찾지 못한 경우 null 반환
    return null;
  };
  
  const foundItem = findItemInDummy(itemId, normalizedType, normalizedCategory);
  // ===== 더미데이터에서 실제 아이템 찾기 끝 =====

  useEffect(() => {
    const loadItemData = async () => {
      setIsLoading(true);
      try {
        // ===== 더미데이터 로드 (백엔드 배포 후 삭제) =====
        setTimeout(() => {
          if (foundItem) {
            setItemData(foundItem);
            setIsLiked(foundItem.liked);
            setLikeCount(foundItem.likeCount);
          } else {
            setError('해당 아이템을 찾을 수 없습니다.');
          }
          setIsLoading(false);
        }, 500);
        // ===== 더미데이터 로드 끝 =====

        // ===== 실제 API 호출 (백엔드 배포 후 주석 해제) =====
        /*
        const response = await fetch(`http://localhost:8080/api/categories/${normalizedCategory}/${normalizedType}/${itemId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const result = await response.json();
        
        if (result.success) {
          setItemData(result.data);
          setIsLiked(result.data.liked);
          setLikeCount(result.data.likeCount);
        } else {
          setError(result.message || '상세 정보를 불러올 수 없습니다.');
        }
        */
        // ===== 실제 API 호출 끝 =====
      } catch (error) {
        console.error('Failed to load item data:', error);
        setError('서버 연결에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadItemData();
  }, [category, itemId, itemType]);

  const handleLikeToggle = async () => {
    try {
      // ===== 더미데이터 좋아요 토글 (백엔드 배포 후 삭제) =====
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      // ===== 더미데이터 좋아요 토글 끝 =====

      // ===== 실제 API 호출 (백엔드 배포 후 주석 해제) =====
      /*
      const response = await fetch(`http://localhost:8080/api/users/stores/${itemId}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();
      
      if (result.success) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      }
      */
      // ===== 실제 API 호출 끝 =====
    } catch (error) {
      console.error('Failed to toggle like:', error);
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
  min-height: 100vh;
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
