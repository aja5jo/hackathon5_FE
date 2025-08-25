import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { storesAPI } from '../../services/api'

function MerchantEventList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ===== 더미 데이터 버전 (주석처리) =====
      /*
      // 더미 이벤트 데이터 (API 명세서 구조에 맞춤)
      const dummyEvents = [
        {
          id: 31,
          storeId: 10,
          name: '아이스 아메리카노 1+1 이벤트',
          description: '무더운 여름, 시원한 이벤트!',
          intro: '흥카페에서 여름을 맞아 아이스 음료 1+1 이벤트를 진행합니다. 많은 방문 부탁드립니다.',
          thumbnail: 'https://cdn.example.com/event/thumb.jpg',
          images: ['https://cdn.example.com/event/img1.jpg', 'https://cdn.example.com/event/img2.jpg'],
          startDate: '2025-08-10',
          endDate: '2025-08-20',
          startTime: '10:00:00',
          endTime: '20:00:00',
          isPopup: true,
          like: 123
        },
        {
          id: 32,
          storeId: 10,
          name: '홍대 클럽 파티',
          description: '주말 밤을 즐겨보세요!',
          intro: '홍대 최고의 클럽에서 특별한 파티를 준비했습니다. DJ와 함께하는 특별한 밤을 경험해보세요.',
          thumbnail: 'https://cdn.example.com/event/club_thumb.jpg',
          images: ['https://cdn.example.com/event/club_img1.jpg'],
          startDate: '2025-01-25',
          endDate: '2025-01-25',
          startTime: '22:00:00',
          endTime: '06:00:00',
          isPopup: false,
          like: 89
        }
      ];
      
      setEvents(dummyEvents);
      */
      
      // ===== 백엔드 API 버전 (활성화) =====
      
      try {
        const result = await storesAPI.getMyEvents();
        
        console.log('이벤트 목록 조회 API 응답:', result);
        console.log('이벤트 데이터 타입:', typeof result.data);
        console.log('이벤트 데이터:', result.data);
        
        if (result.success) {
          console.log('이벤트 조회 성공:', result.message);
          // API 응답이 배열인지 확인하고 설정
          const eventsData = Array.isArray(result.data) ? result.data : [];
          console.log('설정할 이벤트 데이터:', eventsData);
          console.log('이벤트 개수:', eventsData.length);
          setEvents(eventsData);
        } else {
          // API 명세서에 따른 에러 메시지 처리
          if (result.code === 401) {
            alert('로그인이 필요합니다.');
            navigate('/login');
          } else if (result.code === 403) {
            alert('등록된 가게가 없는 사용자입니다.');
            setEvents([]);
          } else {
            alert(result.message || '이벤트 조회에 실패했습니다.');
            setError(result.message || '이벤트 조회에 실패했습니다.');
          }
        }
      } catch (error) {
        console.error('이벤트 조회 API 오류:', error);
        alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
        setError('서버 연결에 실패했습니다.');
        setEvents([]);
      }
      
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('이벤트 목록을 불러오는데 실패했습니다.');
      setEvents([]);
    } finally {
      console.log('fetchMyEvents 완료 - loading을 false로 설정');
      setLoading(false);
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/merchants/events/${eventId}/edit`);
  };

  const handlePartialEdit = (eventId) => {
    navigate(`/merchants/events/${eventId}/partial-edit`);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        // TODO: API 연동
        setEvents(prev => prev.filter(event => event.id !== eventId));
        alert('이벤트가 삭제되었습니다.');
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const getCategoryLabel = (category) => {
    const categories = {
      'CAFE': '카페',
      'CLUB': '클럽',
      'SHOPPING': '쇼핑',
      'ETC': '기타',
      'FOOD': '음식점(술집)',
      'K_POP': 'KPOP',
      'ENTERTAINMENT': '오락',
    };
    return categories[category] || category;
  };

  const getStatusColor = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return '#FEE502'; // 예정
    if (now >= start && now <= end) return '#10B981'; // 진행중
    return '#6B7280'; // 종료
  };

  const getStatusLabel = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return '예정';
    if (now >= start && now <= end) return '진행중';
    return '종료';
  };

  if (loading) {
    console.log('로딩 중 - loading:', loading);
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <LoadingText>이벤트 목록을 불러오는 중...</LoadingText>
        </LoadingContainer>
        <Footer />
      </Container>
    );
  }

  console.log('렌더링 상태:', { loading, events: events.length, error });

  return (
    <Container>
      <Header />
      
      <Content>
        <HeaderSection>
          <Title>내 이벤트 관리</Title>
          <Description>등록한 이벤트들을 조회하고 관리하세요</Description>
          <ActionButtons>
            <AddButton onClick={() => navigate('/merchants/stores/events')}>
              새 이벤트 등록
            </AddButton>
          </ActionButtons>
        </HeaderSection>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        {events.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🎉</EmptyIcon>
            <EmptyTitle>등록된 이벤트가 없습니다</EmptyTitle>
            <EmptyDescription>
              첫 번째 이벤트를 등록해보세요!
            </EmptyDescription>
            <AddButton onClick={() => navigate('/merchants/stores/events')}>
              이벤트 등록하기
            </AddButton>
          </EmptyState>
        ) : (
          <EventGrid>
            {console.log('이벤트 렌더링 시작 - 이벤트 개수:', events.length)}
            {events.map((event) => {
              console.log('이벤트 렌더링:', event);
              return (
                <EventCard key={event.id}>
                  <EventHeader>
                    <EventName>{event.name}</EventName>
                    <StatusBadge>
                      <CategoryBadge category={event.isPopup ? 'POPUP' : 'EVENT'}>
                        {event.isPopup ? '팝업' : '일반 이벤트'}
                      </CategoryBadge>
                      <StatusIndicator color={getStatusColor(event.startDate, event.endDate)}>
                        {getStatusLabel(event.startDate, event.endDate)}
                      </StatusIndicator>
                    </StatusBadge>
                  </EventHeader>
                
                <EventInfo>
                  <InfoRow>
                    <InfoLabel>📝 소개:</InfoLabel>
                    <InfoValue>{event.description}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>📅 기간:</InfoLabel>
                    <InfoValue>{event.startDate} ~ {event.endDate}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>🕐 시간:</InfoLabel>
                    <InfoValue>{event.startTime} ~ {event.endTime}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>👍 좋아요:</InfoLabel>
                    <InfoValue>{event.like}개</InfoValue>
                  </InfoRow>
                </EventInfo>

                <ActionRow>
                  <EditButton onClick={() => handleEdit(event.id)}>
                    전체 수정
                  </EditButton>
                  <PartialEditButton onClick={() => handlePartialEdit(event.id)}>
                    부분 수정
                  </PartialEditButton>
                  <DeleteButton onClick={() => handleDelete(event.id)}>
                    삭제
                  </DeleteButton>
                  <ViewButton onClick={() => navigate(`/events/${event.id}`)}>
                    상세보기
                  </ViewButton>
                </ActionRow>
              </EventCard>
            );
          })}
          </EventGrid>
        )}
      </Content>

      <Footer />
    </Container>
  );
}

export default MerchantEventList;

// ===== styled =====
const Container = styled.div`
  width: 100%;
  background: #f8f9fa;
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: 64px;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 1rem 0;
`;

const Description = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 2rem 0;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const AddButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 10px;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffe95a;
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const LoadingText = styled.div`
  font-size: 1.6rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  color: #666;
  margin: 0 0 1rem 0;
`;

const EmptyDescription = styled.p`
  font-size: 1.4rem;
  color: #888;
  margin: 0 0 2rem 0;
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const EventCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
`;

const EventHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const EventName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 1rem 0;
`;

const StatusBadge = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const CategoryBadge = styled.div`
  padding: 0.5rem 1rem;
  background: ${props => {
    switch (props.category) {
      case 'POPUP':
        return '#FF6B6B';
      case 'EVENT':
        return '#4ECDC4';
      default:
        return '#FEE502';
    }
  }};
  color: ${props => {
    switch (props.category) {
      case 'POPUP':
      case 'EVENT':
        return 'white';
      default:
        return '#262626';
    }
  }};
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StatusIndicator = styled.div`
  padding: 0.5rem 1rem;
  background: ${props => props.color};
  color: white;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const EventInfo = styled.div`
  margin-bottom: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
  align-items: flex-start;
`;

const InfoLabel = styled.span`
  font-size: 1.3rem;
  color: #666;
  min-width: 80px;
`;

const InfoValue = styled.span`
  font-size: 1.3rem;
  color: #262626;
  flex: 1;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
`;

const BaseActionButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
`;

const EditButton = styled(BaseActionButton)`
  background: #FEE502;
  color: #262626;
  border-color: #FEE502;

  &:hover {
    background: #ffe95a;
  }
`;

const PartialEditButton = styled(BaseActionButton)`
  background: #4ECDC4;
  color: white;
  border-color: #4ECDC4;

  &:hover {
    background: #5cd6b0;
  }
`;

const DeleteButton = styled(BaseActionButton)`
  background: white;
  color: #dc2626;
  border-color: #dc2626;

  &:hover {
    background: #fef2f2;
  }
`;

const ViewButton = styled(BaseActionButton)`
  background: white;
  color: #262626;
  border-color: #e5e7eb;

  &:hover {
    background: #f9fafb;
  }
`;