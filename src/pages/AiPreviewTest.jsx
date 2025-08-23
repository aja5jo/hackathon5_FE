import React, { useState } from 'react';
import styled from 'styled-components';
import EventAiPreview from '../components/ai/EventAiPreview';
import PopupAiPreview from '../components/ai/PopupAiPreview';

function AiPreviewTest() {
  const [activeTab, setActiveTab] = useState('event');

  return (
    <Container>
      <Header>
        <Title>AI 홍보글 미리보기 테스트</Title>
        <Description>
          AI를 활용한 이벤트 및 팝업 홍보글 자동 생성 기능을 테스트해보세요.
        </Description>
      </Header>

      <TabContainer>
        <TabButton
          active={activeTab === 'event'}
          onClick={() => setActiveTab('event')}
        >
          이벤트 AI 미리보기
        </TabButton>
        <TabButton
          active={activeTab === 'popup'}
          onClick={() => setActiveTab('popup')}
        >
          팝업 AI 미리보기
        </TabButton>
      </TabContainer>

      <ContentArea>
        {activeTab === 'event' ? <EventAiPreview /> : <PopupAiPreview />}
      </ContentArea>

      <InfoSection>
        <InfoTitle>API 명세서 정보</InfoTitle>
        
        <InfoCard>
          <InfoCardTitle>이벤트 AI 미리보기</InfoCardTitle>
          <InfoList>
            <InfoItem>
              <strong>엔드포인트:</strong> POST /api/merchants/stores/events/preview
            </InfoItem>
            <InfoItem>
              <strong>요청 DTO:</strong> EventAiCreateRequest
            </InfoItem>
            <InfoItem>
              <strong>필수 필드:</strong> name
            </InfoItem>
            <InfoItem>
              <strong>선택 필드:</strong> category, address, introHint, imageUrls
            </InfoItem>
            <InfoItem>
              <strong>응답:</strong> AiPreviewResponse (intro, description)
            </InfoItem>
          </InfoList>
        </InfoCard>

        <InfoCard>
          <InfoCardTitle>팝업 AI 미리보기</InfoCardTitle>
          <InfoList>
            <InfoItem>
              <strong>엔드포인트:</strong> POST /api/merchants/popups/preview
            </InfoItem>
            <InfoItem>
              <strong>요청 DTO:</strong> PopupAiCreateRequest
            </InfoItem>
            <InfoItem>
              <strong>필수 필드:</strong> name, category, address
            </InfoItem>
            <InfoItem>
              <strong>선택 필드:</strong> introHint, imageUrls
            </InfoItem>
            <InfoItem>
              <strong>응답:</strong> AiPreviewResponse (intro, description)
            </InfoItem>
          </InfoList>
        </InfoCard>

        <InfoCard>
          <InfoCardTitle>구현된 기능</InfoCardTitle>
          <InfoList>
            <InfoItem>✅ 명세서에 맞는 DTO 구조 구현</InfoItem>
            <InfoItem>✅ 필수/선택 필드 검증 로직</InfoItem>
            <InfoItem>✅ 다중 이미지 URL 관리 (추가/삭제)</InfoItem>
            <InfoItem>✅ AI 힌트 입력 기능</InfoItem>
            <InfoItem>✅ 더미 데이터로 미리보기 시뮬레이션</InfoItem>
            <InfoItem>✅ 생성된 홍보글 복사 기능</InfoItem>
            <InfoItem>✅ 폼 리셋 기능</InfoItem>
            <InfoItem>✅ 로딩 상태 및 에러 처리</InfoItem>
            <InfoItem>✅ 백엔드 API 연동 준비 (주석처리)</InfoItem>
          </InfoList>
        </InfoCard>
      </InfoSection>
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  width: 100%;
  background: #f8fafc;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.8rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 2rem;
`;

const TabButton = styled.button`
  padding: 1.5rem 3rem;
  background: ${props => props.active ? '#4f46e5' : 'transparent'};
  color: ${props => props.active ? 'white' : '#374151'};
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#4f46e5' : 'transparent'};
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#4338ca' : '#f3f4f6'};
  }
`;

const ContentArea = styled.div`
  background: white;
  min-height: 600px;
`;

const InfoSection = styled.div`
  background: white;
  padding: 3rem 2rem;
  margin-top: 2rem;
`;

const InfoTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  color: #262626;
  margin-bottom: 2rem;
  text-align: center;
`;

const InfoCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const InfoCardTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  font-size: 1.4rem;
  color: #4b5563;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  strong {
    color: #374151;
    font-weight: 600;
  }
`;

export default AiPreviewTest;
