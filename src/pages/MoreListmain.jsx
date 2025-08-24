import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import SearchBox from '../components/home/SearchBox'
import Footer from '../components/common/Footer';
import EventCardList from '../components/common/EventCardList';
import dummyEvents from '../assets/dummy.json'
// import { usersAPI } from '../services/api' // 명세서에 없는 API이므로 제거


function MoreListmain() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        setLoading(true);
        
        // ===== 명세서에 없는 API이므로 더미 데이터 사용 =====
        setEvents(dummyEvents.categories || []);
        
        // ===== 더미데이터 버전 (주석처리) =====
        /*
        setEvents(dummyEvents.categories || []);
        */
        
      } catch (error) {
        console.error('사용자 선호도 데이터 로드 실패:', error);
        // 에러 시 더미 데이터 사용
        setEvents(dummyEvents.categories || []);
      } finally {
        setLoading(false);
      }
    };

    loadUserPreferences();
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingText>사용자 선호도 데이터를 불러오는 중...</LoadingText>
        </LoadingContainer>
        <Footer />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <SectionHeader>
        <Title>
          <Maintitle>나의 취향맞춤 가게 이벤트</Maintitle>
        </Title>
      </SectionHeader>
      <EventCardList events={events}/>
      <Footer/>
    </Container>
  )
}

export default MoreListmain

const Container = styled.main`
  padding: 2rem;
`;
const SectionHeader = styled.div`
  display: flex;
  margin-top: 2rem;
  padding: 1rem;
  gap: 1rem;
  justify-content: center;
`;
const Subtitle = styled.div`
  color: #262626;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
`;
const Maintitle = styled.div`
  color: #262626;
  font-size: 26px;
  font-style: normal;
  font-weight: 600;
  line-height: 32.5px;
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
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
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const ErrorText = styled.div`
  font-size: 1.8rem;
  color: #FF6B35;
`;


