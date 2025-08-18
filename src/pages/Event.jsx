import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import EventBannerSection from '../components/event/EventBannerSection';

function Event() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('인기');
  const [events, setEvents] = useState([]);

  // ===== 더미 이벤트 데이터 =====
  const dummyEvents = {
    '인기': [
      { id: 1, name: '사자 베이커리 오픈', description: '신선한 빵과 커피를 만나보세요', date: '20.03.25 ~ 20.04.25 15시', image: 'https://picsum.photos/seed/bakery1/300/200' },
      { id: 2, name: '사자 지혜', description: '지혜로운 시간을 보내세요', date: '20.03.26 ~ 20.04.26 14시', image: 'https://picsum.photos/seed/wisdom1/300/200' },
      { id: 3, name: '오명 SHOW', description: '특별한 공연을 경험하세요', date: '20.03.27 ~ 20.04.27 16시', image: 'https://picsum.photos/seed/show1/300/200' },
      { id: 4, name: '백행이 라떼', description: '맛있는 라떼를 즐겨보세요', date: '20.03.28 ~ 20.04.28 13시', image: 'https://picsum.photos/seed/latte1/300/200' },
      { id: 5, name: '사자 백화점', description: '다양한 상품을 만나보세요', date: '20.03.29 ~ 20.04.29 12시', image: 'https://picsum.photos/seed/department1/300/200' },
      { id: 6, name: '사자 입구점', description: '입구에서 특별한 경험을', date: '20.03.30 ~ 20.04.30 11시', image: 'https://picsum.photos/seed/entrance1/300/200' }
    ],
    '진행중': [
      { id: 7, name: '사자 베이커리 오픈', description: '신선한 빵과 커피를 만나보세요', date: '20.03.25 ~ 20.04.25 15시', image: 'https://picsum.photos/seed/bakery2/300/200' },
      { id: 8, name: '사자 카페', description: '편안한 카페 시간을 보내세요', date: '20.03.26 ~ 20.04.26 14시', image: 'https://picsum.photos/seed/cafe1/300/200' },
      { id: 9, name: '백행이 할인', description: '특별한 할인 혜택을 누리세요', date: '20.03.27 ~ 20.04.27 16시', image: 'https://picsum.photos/seed/discount1/300/200' },
      { id: 10, name: '사자 노래방', description: '즐거운 노래 시간을 보내세요', date: '20.03.28 ~ 20.04.28 13시', image: 'https://picsum.photos/seed/karaoke1/300/200' },
      { id: 11, name: '사자 백화점', description: '다양한 상품을 만나보세요', date: '20.03.29 ~ 20.04.29 12시', image: 'https://picsum.photos/seed/department2/300/200' },
      { id: 12, name: '사자 빵집', description: '맛있는 빵을 즐겨보세요', date: '20.03.30 ~ 20.04.30 11시', image: 'https://picsum.photos/seed/bread1/300/200' }
    ],
    '오늘의 핫': [
      { id: 13, name: '오명 SHOW', description: '특별한 공연을 경험하세요', date: '20.03.25 ~ 20.04.25 15시', image: 'https://picsum.photos/seed/show2/300/200' },
      { id: 14, name: '백행의 사자', description: '백행이와 함께하는 특별한 시간', date: '20.03.26 ~ 20.04.26 14시', image: 'https://picsum.photos/seed/baekhang1/300/200' },
      { id: 15, name: '사자 입구점', description: '입구에서 특별한 경험을', date: '20.03.27 ~ 20.04.27 16시', image: 'https://picsum.photos/seed/entrance2/300/200' }
    ],
    '예정': [
      { id: 16, name: '사자 지혜', description: '지혜로운 시간을 보내세요', date: '20.04.01 ~ 20.05.01 15시', image: 'https://picsum.photos/seed/wisdom2/300/200' },
      { id: 17, name: '백행이 할인', description: '특별한 할인 혜택을 누리세요', date: '20.04.02 ~ 20.05.02 14시', image: 'https://picsum.photos/seed/discount2/300/200' },
      { id: 18, name: '사자 굿즈', description: '특별한 굿즈를 만나보세요', date: '20.04.03 ~ 20.05.03 16시', image: 'https://picsum.photos/seed/goods1/300/200' }
    ]
  };
=======
import Footer from '../components/common/Footer';
import EventBannerSection from '../components/event/EventBannerSection';
import EventCard from '../components/common/EventCard';
import { useTranslation } from '../utils/translations';

function Event() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('인기');
  const [events, setEvents] = useState([]);
  
  // ===== 더미 이벤트 데이터 =====
  const getDummyEvents = () => ({
    '인기': [
      { id: 1, name: '사자 베이커리 팝업', description: '맛있는 빵을 위한 이번달 단 하나의 사자 팝업', startDate: '25.03.06', endDate: '25.04.11', thumbnail: 'https://picsum.photos/seed/bakery1/300/200', likeCount: 128, status: '진행중', category: '이벤트', type: 'event', location: '홍대' },
      { id: 2, name: '사자 카페', description: '핵심 원두로 커피를! 아메리카노 10% 할인 이벤트', startDate: '25.03.06', endDate: '25.04.12', thumbnail: 'https://picsum.photos/seed/cafe1/300/200', likeCount: 95, status: '진행중', category: '이벤트', type: 'event', location: '홍대' },
      { id: 3, name: '멋쟁이 KPOP', description: 'KPOP 팬들을 위한 특별한 이벤트', startDate: '25.03.07', endDate: '25.04.13', thumbnail: 'https://picsum.photos/seed/kpop1/300/200', likeCount: 156, status: '추천', category: '이벤트', type: 'event', location: '홍대' },
      { id: 4, name: '멋쟁이 맛집', description: '홍대 최고의 맛집들을 한눈에', startDate: '25.03.08', endDate: '25.04.14', thumbnail: 'https://picsum.photos/seed/food1/300/200', likeCount: 89, status: '추천', category: '이벤트', type: 'event', location: '홍대' },
      { id: 5, name: '사자 백화점', description: '다양한 상품을 만나보세요', startDate: '25.03.09', endDate: '25.04.15', thumbnail: 'https://picsum.photos/seed/department1/300/200', likeCount: 67, status: '진행중', category: '이벤트', type: 'event', location: '홍대' },
      { id: 6, name: '사자 입구점', description: '입구에서 특별한 경험을', startDate: '25.03.10', endDate: '25.04.16', thumbnail: 'https://picsum.photos/seed/entrance1/300/200', likeCount: 112, status: '오늘마감', category: '이벤트', type: 'event', location: '홍대' },
      { id: 7, name: '사자 당구장', description: '즐거운 당구 시간을 보내세요', startDate: '25.03.11', endDate: '25.04.17', thumbnail: 'https://picsum.photos/seed/billiard1/300/200', likeCount: 78, status: '예정', category: '이벤트', type: 'event', location: '홍대' },
      { id: 8, name: '사자 방탈출', description: '두뇌 게임으로 특별한 경험을', startDate: '25.03.12', endDate: '25.04.18', thumbnail: 'https://picsum.photos/seed/escape1/300/200', likeCount: 134, status: '사전신청', category: '이벤트', type: 'event', location: '홍대' }
    ],
    '진행중': [
      { id: 9, name: '사자 베이커리 팝업', description: '신선한 빵과 커피를 만나보세요', startDate: '25.03.25', endDate: '25.04.25', thumbnail: 'https://picsum.photos/seed/bakery2/300/200', likeCount: 128, status: '진행중', category: '이벤트', type: 'event', location: '홍대' },
      { id: 10, name: '사자 카페', description: '편안한 카페 시간을 보내세요', startDate: '25.03.26', endDate: '25.04.26', thumbnail: 'https://picsum.photos/seed/cafe2/300/200', likeCount: 95, status: '진행중', category: '이벤트', type: 'event', location: '홍대' },
      { id: 11, name: '백행이 할인', description: '특별한 할인 혜택을 누리세요', startDate: '25.03.27', endDate: '25.04.27', thumbnail: 'https://picsum.photos/seed/discount1/300/200', likeCount: 156, status: '진행중', category: '이벤트', type: 'event', location: '홍대' },
      { id: 12, name: '사자 노래방', description: '즐거운 노래 시간을 보내세요', startDate: '25.03.28', endDate: '25.04.28', thumbnail: 'https://picsum.photos/seed/karaoke1/300/200', likeCount: 89, status: '진행중', category: '이벤트', type: 'event', location: '홍대' },
      { id: 13, name: '사자 백화점', description: '다양한 상품을 만나보세요', startDate: '25.03.29', endDate: '25.04.29', thumbnail: 'https://picsum.photos/seed/department2/300/200', likeCount: 67, status: '진행중', category: '이벤트', type: 'event', location: '홍대' },
      { id: 14, name: '사자 빵집', description: '맛있는 빵을 즐겨보세요', startDate: '25.03.30', endDate: '25.04.30', thumbnail: 'https://picsum.photos/seed/bread1/300/200', likeCount: 112, status: '진행중', category: '이벤트', type: 'event', location: '홍대' },
      { id: 15, name: '사자 굿즈', description: '특별한 굿즈를 만나보세요', startDate: '25.03.31', endDate: '25.05.01', thumbnail: 'https://picsum.photos/seed/goods1/300/200', likeCount: 78, status: '진행중', category: '이벤트', type: 'event', location: '홍대' },
      { id: 16, name: '사자 라떼', description: '맛있는 라떼를 즐겨보세요', startDate: '25.04.01', endDate: '25.05.02', thumbnail: 'https://picsum.photos/seed/latte1/300/200', likeCount: 134, status: '진행중', category: '이벤트', type: 'event', location: '홍대' }
    ],
    '오늘마감': [
      { id: 17, name: '오명 SHOW', description: '특별한 공연을 경험하세요', startDate: '25.03.25', endDate: '25.04.25', thumbnail: 'https://picsum.photos/seed/show2/300/200', likeCount: 200, status: '오늘마감', category: '이벤트', type: 'event', location: '홍대' },
      { id: 18, name: '백행의 사자', description: '백행이와 함께하는 특별한 시간', startDate: '25.03.26', endDate: '25.04.26', thumbnail: 'https://picsum.photos/seed/baekhang1/300/200', likeCount: 167, status: '오늘마감', category: '이벤트', type: 'event', location: '홍대' },
      { id: 19, name: '사자 입구점', description: '입구에서 특별한 경험을', startDate: '25.03.27', endDate: '25.04.27', thumbnail: 'https://picsum.photos/seed/entrance2/300/200', likeCount: 145, status: '오늘마감', category: '이벤트', type: 'event', location: '홍대' },
      { id: 20, name: '사자 SHOW', description: '멋진 공연을 만나보세요', startDate: '25.03.28', endDate: '25.04.28', thumbnail: 'https://picsum.photos/seed/show3/300/200', likeCount: 178, status: '오늘마감', category: '이벤트', type: 'event', location: '홍대' }
    ],
    '예정': [
      { id: 21, name: '사자 지혜', description: '지혜로운 시간을 보내세요', startDate: '25.04.01', endDate: '25.05.01', thumbnail: 'https://picsum.photos/seed/wisdom2/300/200', likeCount: 89, status: '예정', category: '이벤트', type: 'event', location: '홍대' },
      { id: 22, name: '백행이 할인', description: '특별한 할인 혜택을 누리세요', startDate: '25.04.02', endDate: '25.05.02', thumbnail: 'https://picsum.photos/seed/discount2/300/200', likeCount: 123, status: '예정', category: '이벤트', type: 'event', location: '홍대' },
      { id: 23, name: '사자 굿즈', description: '특별한 굿즈를 만나보세요', startDate: '25.04.03', endDate: '25.05.03', thumbnail: 'https://picsum.photos/seed/goods2/300/200', likeCount: 67, status: '예정', category: '이벤트', type: 'event', location: '홍대' },
      { id: 24, name: '사자 라떼', description: '맛있는 라떼를 즐겨보세요', startDate: '25.04.04', endDate: '25.05.04', thumbnail: 'https://picsum.photos/seed/latte2/300/200', likeCount: 98, status: '예정', category: '이벤트', type: 'event', location: '홍대' }
    ]
  });
  
  const dummyEvents = getDummyEvents();
>>>>>>> main

  useEffect(() => {
    setEvents(dummyEvents[activeCategory] || []);
  }, [activeCategory]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

<<<<<<< HEAD
  const handleEventClick = (event) => {
    console.log('이벤트 클릭:', event);
    navigate(`/events/${event.id}`);
  };

  return (
    <Container>
      <Header />
      
=======
  return (
    <Container>
>>>>>>> main
      {/* 배너 섹션 */}
      <EventBannerSection />

      {/* 카테고리 필터 */}
      <CategoryFilter>
        {Object.keys(dummyEvents).map((category) => (
          <CategoryButton
            key={category}
            active={activeCategory === category}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryFilter>

<<<<<<< HEAD
      {/* 현재 카테고리 표시 */}
      <CurrentCategory>
        <CategoryLabel>{activeCategory}</CategoryLabel>
      </CurrentCategory>

      {/* 이벤트 그리드 */}
      <EventGrid>
        {events.map((event) => (
          <EventCard key={event.id} onClick={() => handleEventClick(event)}>
            <EventImage>
              <img src={event.image} alt={event.name} />
              <InfoIcon>i</InfoIcon>
            </EventImage>
            <EventContent>
              <EventTag>{activeCategory}</EventTag>
              <EventTitle>{event.name}</EventTitle>
              <EventDescription>{event.description}</EventDescription>
              <EventDate>{event.date}</EventDate>
            </EventContent>
          </EventCard>
        ))}
      </EventGrid>
=======
      {/* 이벤트 목록 */}
      <EventSection>
        <SectionHeader>
          <SectionTitle>{activeCategory}</SectionTitle>
          <MoreButton>더보기 &gt;</MoreButton>
        </SectionHeader>
        
        <EventGrid>
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              excludeStatuses={['추천', '사전신청', '오늘마감']}
            />
          ))}
        </EventGrid>
      </EventSection>
>>>>>>> main

      <Footer />
    </Container>
  );
}

<<<<<<< HEAD
export default Event;

const Container = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  position: relative;
`;

// BannerSection 관련 스타일들은 EventBannerSection 컴포넌트로 이동됨

const CategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
  background-color: white;
`;

const CategoryButton = styled.button`
  padding: 1rem 2rem;
  background-color: #FFD700;
  color: #262626;
  border: none;
  border-radius: 20px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => props.active ? 1 : 0.7};
  box-shadow: ${props => props.active ? '0 4px 8px rgba(255, 215, 0, 0.3)' : 'none'};

  &:hover {
    opacity: 1;
    transform: translateY(-2px);
  }
`;

const CurrentCategory = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #e9ecef;
`;

const CategoryLabel = styled.div`
  padding: 0.5rem 1rem;
  background-color: #FFD700;
  color: #262626;
  border-radius: 6px;
  font-size: 1.4rem;
  font-weight: 600;
=======
const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const CategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background-color: white;
  border-bottom: 1px solid #e9ecef;
`;

const CategoryButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.active ? '#FEE502' : '#f8f9fa'};
  color: ${props => props.active ? '#262626' : '#666'};
  border: none;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#E6CF00' : '#e9ecef'};
  }
`;

const EventSection = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: #262626;
  margin: 0;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 1.6rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
>>>>>>> main
`;

const EventGrid = styled.div`
  display: grid;
<<<<<<< HEAD
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const EventCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
`;

const EventImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #ccc;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background-color: rgba(0,0,0,0.7);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventTag = styled.div`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background-color: #FFD700;
  color: #262626;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const EventTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 0.5rem 0;
`;

const EventDescription = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.4;
`;

const EventDate = styled.div`
  font-size: 1.2rem;
  color: #999;
  font-weight: 500;
`;
=======
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;
>>>>>>> main
