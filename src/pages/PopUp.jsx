import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import PopupBannerSection from '../components/popup/PopupBannerSection';
import EventCard from '../components/common/EventCard';
import { eventsAPI } from '../services/api';


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
      startDate: '2025.01.15',
      endDate: '2025.01.21',
      location: '홍대 걷고싶은거리',
      description: '신선한 빵과 커피를 만나볼 수 있는 특별한 팝업스토어',
      thumbnail: 'https://picsum.photos/seed/popup1/400/300',
      likeCount: 245,
      liked: false,
      week: '이번주',
      type: 'popup'
    },
    {
      id: 2,
      name: 'K-POP 굿즈 팝업',
      category: 'KPOP',
      status: '예정',
      startDate: '2025.01.22',
      endDate: '2025.01.28',
      location: '홍대 AK플라자',
      description: '최신 K-POP 아티스트 굿즈와 포토존이 준비된 팝업',
      thumbnail: 'https://picsum.photos/seed/popup2/400/300',
      likeCount: 892,
      liked: true,
      week: '다음주',
      type: 'popup'
    },
    {
      id: 3,
      name: '빈티지 패션 마켓',
      category: '쇼핑',
      status: '진행중',
      startDate: '2025.01.13',
      endDate: '2025.01.19',
      location: '홍대 상상마당',
      description: '독특한 빈티지 아이템들을 만날 수 있는 패션 팝업',
      thumbnail: 'https://picsum.photos/seed/popup3/400/300',
      likeCount: 156,
      liked: false,
      week: '이번주',
      type: 'popup'
    },
    {
      id: 4,
      name: '스트리트 아트 전시',
      category: '문화생활',
      status: '예정',
      startDate: '2025.01.25',
      endDate: '2025.02.01',
      location: '홍대 홍익대학교',
      description: '젊은 아티스트들의 스트리트 아트 작품 전시',
      thumbnail: 'https://picsum.photos/seed/popup4/400/300',
      likeCount: 324,
      liked: true,
      week: '다음주',
      type: 'popup'
    },
    {
      id: 5,
      name: '클럽 파티 팝업',
      category: '클럽',
      status: '진행중',
      startDate: '2025.01.16',
      endDate: '2025.01.18',
      location: '홍대 클럽타운',
      description: '특별한 DJ와 함께하는 주말 클럽 파티',
      thumbnail: 'https://picsum.photos/seed/popup5/400/300',
      likeCount: 567,
      liked: false,
      week: '이번주',
      type: 'popup'
    },
    {
      id: 6,
      name: '음식점 페스티벌',
      category: '음식점',
      status: '예정',
      startDate: '2025.01.29',
      endDate: '2025.02.05',
      location: '홍대 연남동',
      description: '홍대 맛집들이 모인 특별한 음식 페스티벌',
      thumbnail: 'https://picsum.photos/seed/popup6/400/300',
      likeCount: 678,
      liked: true,
      week: '다음주',
      type: 'popup'
    }
  ];

  useEffect(() => {
    // ===== 백엔드 API 버전 (활성화) =====
    const loadPopupsFromAPI = async () => {
      try {
        const result = await eventsAPI.getPopups();
        
        if (result.success && result.data) {
          let popups = [];
          
          // API 응답 구조에 따라 데이터 추출
          if (Array.isArray(result.data)) {
            popups = result.data;
          } else if (result.data.popups && Array.isArray(result.data.popups)) {
            popups = result.data.popups;
          } else if (result.data.data && Array.isArray(result.data.data)) {
            popups = result.data.data;
          } else {
            console.warn('예상하지 못한 팝업 API 응답 구조:', result.data);
            popups = [];
          }
          let filteredPopups = popups;
          
          if (activeFilter === '이번주') {
            const currentDate = new Date();
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            filteredPopups = popups.filter(popup => {
              const popupStartDate = new Date(popup.startDate);
              const popupEndDate = new Date(popup.endDate);
              return popupStartDate <= endOfWeek && popupEndDate >= startOfWeek;
            });
          } else if (activeFilter === '다음주') {
            const currentDate = new Date();
            const nextWeekStart = new Date(currentDate);
            nextWeekStart.setDate(currentDate.getDate() + (7 - currentDate.getDay()));
            const nextWeekEnd = new Date(nextWeekStart);
            nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
            
            filteredPopups = popups.filter(popup => {
              const popupStartDate = new Date(popup.startDate);
              return popupStartDate >= nextWeekStart && popupStartDate <= nextWeekEnd;
            });
          } else if (activeFilter === '진행중') {
            const currentDate = new Date();
            filteredPopups = popups.filter(popup => {
              const popupStartDate = new Date(popup.startDate);
              const popupEndDate = new Date(popup.endDate);
              return popupStartDate <= currentDate && popupEndDate >= currentDate;
            });
          } else if (activeFilter === '예정') {
            const currentDate = new Date();
            filteredPopups = popups.filter(popup => {
              const popupStartDate = new Date(popup.startDate);
              return popupStartDate > currentDate;
            });
          }
          
          setPopupEvents(filteredPopups);
        } else {
          console.error('팝업 데이터 로드 실패:', result.message);
          // 에러 시 더미 데이터 사용
          filterPopups(activeFilter);
        }
        
      } catch (error) {
        console.error('API 호출 실패:', error);
        // 에러 시 더미 데이터 사용
        filterPopups(activeFilter);
      }
    };
    
    loadPopupsFromAPI();
    
    // ===== 더미데이터 버전 (주석처리) =====
    // filterPopups(activeFilter);
    
  }, [activeFilter]);

  const filterPopups = (filter) => {
    // ===== 현재 더미데이터 버전 (실제 사용 중) =====
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
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handlePopupClick = (popup) => {
    console.log('팝업 클릭:', popup);
    navigate(`/events/${popup.id}`);
  };

  return (
    <Container>
      {/* 배너 섹션 */}
      <PopupBannerSection/>
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
          <EventCard 
            key={popup.id} 
            event={popup}
            excludeStatuses={[]}
          />
        ))}
      </PopupGrid>

      <Footer />
    </Container>
  );
}

export default PopUp;

const Container = styled.div`
  background-color: #ffffff;
  position: relative;
  width: 100%;
`;

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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;