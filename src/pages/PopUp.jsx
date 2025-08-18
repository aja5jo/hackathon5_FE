import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import bannerImg from '../assets/banner.png';
=======
import Footer from '../components/common/Footer';
import PopupBannerSection from '../components/popup/PopupBannerSection';
import EventCard from '../components/common/EventCard';
>>>>>>> main

function PopUp() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('전체');
  const [popupEvents, setPopupEvents] = useState([]);

  // 필터 카테고리
  const filterCategories = ['전체', '이번주', '다음주', '진행중', '예정'];

  // 더미 팝업 데이터
  const dummyPopupData = [
    {
      id: 1,
      name: '사자 베이커리 팝업스토어',
      category: '카페',
      status: '진행중',
<<<<<<< HEAD
      period: '2025.01.15 - 2025.01.21',
      location: '홍대 걷고싶은거리',
      description: '신선한 빵과 커피를 만나볼 수 있는 특별한 팝업스토어',
      image: 'https://picsum.photos/seed/popup1/400/300',
      likeCount: 245,
      liked: false,
      week: '이번주'
=======
      startDate: '2025.01.15',
      endDate: '2025.01.21',
      location: '홍대 걷고싶은거리',
      description: '신선한 빵과 커피를 만나볼 수 있는 특별한 팝업스토어',
      thumbnail: 'https://picsum.photos/seed/popup1/400/300',
      likeCount: 245,
      liked: false,
      week: '이번주',
      type: 'popup'
>>>>>>> main
    },
    {
      id: 2,
      name: 'K-POP 굿즈 팝업',
      category: 'KPOP',
      status: '예정',
<<<<<<< HEAD
      period: '2025.01.22 - 2025.01.28',
      location: '홍대 AK플라자',
      description: '최신 K-POP 아티스트 굿즈와 포토존이 준비된 팝업',
      image: 'https://picsum.photos/seed/popup2/400/300',
      likeCount: 892,
      liked: true,
      week: '다음주'
=======
      startDate: '2025.01.22',
      endDate: '2025.01.28',
      location: '홍대 AK플라자',
      description: '최신 K-POP 아티스트 굿즈와 포토존이 준비된 팝업',
      thumbnail: 'https://picsum.photos/seed/popup2/400/300',
      likeCount: 892,
      liked: true,
      week: '다음주',
      type: 'popup'
>>>>>>> main
    },
    {
      id: 3,
      name: '빈티지 패션 마켓',
      category: '쇼핑',
      status: '진행중',
<<<<<<< HEAD
      period: '2025.01.13 - 2025.01.19',
      location: '홍대 상상마당',
      description: '독특한 빈티지 아이템들을 만날 수 있는 패션 팝업',
      image: 'https://picsum.photos/seed/popup3/400/300',
      likeCount: 156,
      liked: false,
      week: '이번주'
=======
      startDate: '2025.01.13',
      endDate: '2025.01.19',
      location: '홍대 상상마당',
      description: '독특한 빈티지 아이템들을 만날 수 있는 패션 팝업',
      thumbnail: 'https://picsum.photos/seed/popup3/400/300',
      likeCount: 156,
      liked: false,
      week: '이번주',
      type: 'popup'
>>>>>>> main
    },
    {
      id: 4,
      name: '스트리트 아트 전시',
      category: '문화생활',
      status: '예정',
<<<<<<< HEAD
      period: '2025.01.25 - 2025.02.01',
      location: '홍대 홍익대학교',
      description: '젊은 아티스트들의 스트리트 아트 작품 전시',
      image: 'https://picsum.photos/seed/popup4/400/300',
      likeCount: 324,
      liked: true,
      week: '다음주'
=======
      startDate: '2025.01.25',
      endDate: '2025.02.01',
      location: '홍대 홍익대학교',
      description: '젊은 아티스트들의 스트리트 아트 작품 전시',
      thumbnail: 'https://picsum.photos/seed/popup4/400/300',
      likeCount: 324,
      liked: true,
      week: '다음주',
      type: 'popup'
>>>>>>> main
    },
    {
      id: 5,
      name: '클럽 파티 팝업',
      category: '클럽',
      status: '진행중',
<<<<<<< HEAD
      period: '2025.01.16 - 2025.01.18',
      location: '홍대 클럽타운',
      description: '특별한 DJ와 함께하는 주말 클럽 파티',
      image: 'https://picsum.photos/seed/popup5/400/300',
      likeCount: 567,
      liked: false,
      week: '이번주'
=======
      startDate: '2025.01.16',
      endDate: '2025.01.18',
      location: '홍대 클럽타운',
      description: '특별한 DJ와 함께하는 주말 클럽 파티',
      thumbnail: 'https://picsum.photos/seed/popup5/400/300',
      likeCount: 567,
      liked: false,
      week: '이번주',
      type: 'popup'
>>>>>>> main
    },
    {
      id: 6,
      name: '음식점 페스티벌',
      category: '음식점',
      status: '예정',
<<<<<<< HEAD
      period: '2025.01.29 - 2025.02.05',
      location: '홍대 연남동',
      description: '홍대 맛집들이 모인 특별한 음식 페스티벌',
      image: 'https://picsum.photos/seed/popup6/400/300',
      likeCount: 678,
      liked: true,
      week: '다음주'
=======
      startDate: '2025.01.29',
      endDate: '2025.02.05',
      location: '홍대 연남동',
      description: '홍대 맛집들이 모인 특별한 음식 페스티벌',
      thumbnail: 'https://picsum.photos/seed/popup6/400/300',
      likeCount: 678,
      liked: true,
      week: '다음주',
      type: 'popup'
>>>>>>> main
    }
  ];

  useEffect(() => {
    filterPopups(activeFilter);
  }, [activeFilter]);

  const filterPopups = (filter) => {
<<<<<<< HEAD
    let filtered = dummyPopupData;
    
    if (filter !== '전체') {
      if (filter === '이번주' || filter === '다음주') {
        filtered = dummyPopupData.filter(popup => popup.week === filter);
      } else {
        filtered = dummyPopupData.filter(popup => popup.status === filter);
      }
    }
    
    setPopupEvents(filtered);
=======
    if (filter === '전체') {
      setPopupEvents(dummyPopupData);
    } else if (filter === '이번주') {
      setPopupEvents(dummyPopupData.filter(popup => popup.week === '이번주'));
    } else if (filter === '다음주') {
      setPopupEvents(dummyPopupData.filter(popup => popup.week === '다음주'));
    } else if (filter === '진행중') {
      setPopupEvents(dummyPopupData.filter(popup => popup.status === '진행중'));
    } else if (filter === '예정') {
      setPopupEvents(dummyPopupData.filter(popup => popup.status === '예정'));
    }
>>>>>>> main
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

<<<<<<< HEAD
  const handleLikeToggle = (id) => {
    setPopupEvents(prev => 
      prev.map(popup => 
        popup.id === id 
          ? { ...popup, liked: !popup.liked, likeCount: popup.liked ? popup.likeCount - 1 : popup.likeCount + 1 }
          : popup
      )
    );
  };

  const handlePopupClick = (popup) => {
    console.log('팝업 클릭:', popup);
    navigate(`/events/${popup.id}`);
  };

  return (
    <Container>
      <Header />
      
      {/* 배너 섹션 */}
      <BannerSection>
        <BannerContent>
          <BannerTitle>이번주 팝업 스테이션</BannerTitle>
          <BannerSubtitle>홍대에서 진행되는 특별한 팝업들을 만나보세요</BannerSubtitle>
        </BannerContent>
      </BannerSection>

=======
  return (
    <Container>
      {/* 배너 섹션 */}
      <PopupBannerSection/>
>>>>>>> main
      {/* 필터 섹션 */}
      <FilterSection>
        <FilterContainer>
          {filterCategories.map((filter) => (
            <FilterButton
              key={filter}
              active={activeFilter === filter}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </FilterButton>
          ))}
        </FilterContainer>
      </FilterSection>

      {/* 현재 필터 표시 */}
      <CurrentFilter>
        <FilterLabel>{activeFilter}</FilterLabel>
        <EventCount>{popupEvents.length}개의 팝업</EventCount>
      </CurrentFilter>

      {/* 팝업 그리드 */}
      <PopupGrid>
        {popupEvents.map((popup) => (
<<<<<<< HEAD
          <PopupCard key={popup.id} onClick={() => handlePopupClick(popup)}>
            <PopupImage>
              <img src={popup.image} alt={popup.name} />
              <LikeContainer>
                <LikeButton onClick={(e) => {
                  e.stopPropagation();
                  handleLikeToggle(popup.id);
                }}>
                  {popup.liked ? '❤️' : '🤍'}
                </LikeButton>
                <LikeCount>{popup.likeCount}</LikeCount>
              </LikeContainer>
              <StatusBadge status={popup.status}>{popup.status}</StatusBadge>
            </PopupImage>
            <PopupContent>
              <CategoryTag>{popup.category}</CategoryTag>
              <PopupTitle>{popup.name}</PopupTitle>
              <PopupDescription>{popup.description}</PopupDescription>
              <PopupInfo>
                <InfoItem>📅 {popup.period}</InfoItem>
                <InfoItem>📍 {popup.location}</InfoItem>
              </PopupInfo>
            </PopupContent>
          </PopupCard>
=======
          <EventCard 
            key={popup.id} 
            event={popup}
            excludeStatuses={[]}
          />
>>>>>>> main
        ))}
      </PopupGrid>

      <Footer />
    </Container>
  );
}

export default PopUp;

const Container = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  position: relative;
`;

<<<<<<< HEAD
const BannerSection = styled.div`
  width: 100%;
  height: 300px;
  background: 
    linear-gradient(0deg, rgba(102, 92, 14, 0.3) 0%, rgba(102, 92, 14, 0.3) 100%),
    url(${bannerImg});
  background-size: cover;
  background-position: center;
  margin-top: 64px;
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

=======
>>>>>>> main
const FilterSection = styled.div`
  background-color: white;
  padding: 2rem 0;
  border-bottom: 1px solid #e9ecef;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FilterButton = styled.button`
  padding: 1rem 2rem;
  background-color: ${props => props.active ? '#FEE502' : 'transparent'};
  color: #262626;
  border: 2px solid ${props => props.active ? '#FEE502' : '#E5E5E5'};
  border-radius: 25px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #FEE502;
    background-color: ${props => props.active ? '#FEE502' : '#FFF9C4'};
    transform: translateY(-2px);
  }
`;

const CurrentFilter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const FilterLabel = styled.div`
  padding: 0.8rem 1.5rem;
  background-color: #FEE502;
  color: #262626;
  border-radius: 20px;
  font-size: 1.6rem;
  font-weight: 600;
`;

const EventCount = styled.div`
  font-size: 1.4rem;
  color: #666;
  font-weight: 500;
`;

const PopupGrid = styled.div`
  display: grid;
<<<<<<< HEAD
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem 2rem;
`;

const PopupCard = styled.div`
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
`;

const PopupImage = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const LikeContainer = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const LikeButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const LikeCount = styled.span`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 500;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 0.5rem 1rem;
  background-color: ${props => 
    props.status === '진행중' ? '#10B981' : 
    props.status === '예정' ? '#F59E0B' : '#6B7280'
  };
  color: white;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const PopupContent = styled.div`
  padding: 2rem;
`;

const CategoryTag = styled.div`
  display: inline-block;
  padding: 0.4rem 1rem;
  background-color: #FEE502;
  color: #262626;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const PopupTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 1rem 0;
  line-height: 1.3;
`;

const PopupDescription = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PopupInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  font-size: 1.3rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 0.5rem;
=======
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
>>>>>>> main
`;