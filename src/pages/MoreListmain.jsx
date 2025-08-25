import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import SearchBox from '../components/home/SearchBox'
import Footer from '../components/common/Footer';
import EventCardList from '../components/common/EventCardList';
import { mainAPI } from '../services/api'


function MoreListmain() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        setLoading(true);
        
        console.log('MoreListmain: /api/home/detail 호출 (18개)');
        
        // ✅ API 명세서에 맞춰 /api/home/detail 호출 (18개)
        const result = await mainAPI.getHomeDetail();
        
        console.log('MoreListmain API 응답:', result);
        
        if (result.success && result.data) {
          // ✅ 서버 포맷 신뢰: 백엔드가 준 구조 그대로 사용
          let combinedData = [];
          
          if (result.data.stores || result.data.events) {
            // 명세서 구조: {stores: [], events: []}
            const stores = result.data.stores || [];
            const events = result.data.events || [];
            combinedData = [...stores, ...events];
            console.log('MoreListmain - 가게:', stores.length, '개, 이벤트:', events.length, '개');
          } else if (Array.isArray(result.data)) {
            // 대체 구조: 직접 배열
            combinedData = result.data;
            console.log('MoreListmain - 직접 배열 데이터:', combinedData.length, '개');
          } else {
            console.log('MoreListmain - 알 수 없는 데이터 구조:', result.data);
            combinedData = [];
          }
          
                     // ✅ 서버 랭킹 보존: 단일 그룹으로 그대로 전달
           let finalData = combinedData;
           
           // ✅ 비로그인 상태일 때 좋아요 순으로 정렬
           const user = localStorage.getItem('user');
           if (!user) {
             console.log('MoreListmain - 비로그인 상태: 좋아요 순으로 정렬 적용');
             finalData = combinedData.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
           }
           
           const eventCardListData = [{ category: 'ALL', items: finalData }];
           setEvents(eventCardListData);
          
        } else {
          console.log('MoreListmain - API 응답이 성공이 아니거나 데이터가 없음');
          setEvents([]);
        }
        
      } catch (error) {
        console.error('MoreListmain - 사용자 선호도 데이터 로드 실패:', error);
        setEvents([]);
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


