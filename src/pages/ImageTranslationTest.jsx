import React, { useState } from 'react';
import styled from 'styled-components';
import SmartImageTranslator from '../components/translation/SmartImageTranslator';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ImageTranslationTest = () => {
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [translationResult, setTranslationResult] = useState(null);

  // 테스트용 이미지 URL들
  const testImages = [
    {
      name: '메뉴판 예시 1',
      url: 'https://picsum.photos/seed/menu1/400/300',
      description: '한국 음식점 메뉴판'
    },
    {
      name: '메뉴판 예시 2', 
      url: 'https://picsum.photos/seed/menu2/400/300',
      description: '카페 메뉴판'
    },
    {
      name: '일반 이미지 예시',
      url: 'https://picsum.photos/seed/general/400/300',
      description: '일반 텍스트가 포함된 이미지'
    }
  ];

  const handleImageSelect = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setTranslationResult(null);
  };

  const handleTranslationComplete = (result) => {
    setTranslationResult(result);
    console.log('번역 완료:', result);
  };

  return (
    <Container>
      <Header />
      
      <MainContent>
        <Title>이미지 번역 테스트</Title>
        <Subtitle>API 명세서에 맞는 스마트 이미지 번역 기능을 테스트해보세요</Subtitle>

        {/* 테스트 이미지 선택 */}
        <ImageSelectionSection>
          <SectionTitle>테스트 이미지 선택</SectionTitle>
          <ImageGrid>
            {testImages.map((image, index) => (
              <ImageCard 
                key={index}
                onClick={() => handleImageSelect(image.url)}
                isSelected={selectedImageUrl === image.url}
              >
                <ImagePreview src={image.url} alt={image.name} />
                <ImageInfo>
                  <ImageName>{image.name}</ImageName>
                  <ImageDescription>{image.description}</ImageDescription>
                </ImageInfo>
              </ImageCard>
            ))}
          </ImageGrid>
        </ImageSelectionSection>

        {/* 선택된 이미지 표시 */}
        {selectedImageUrl && (
          <SelectedImageSection>
            <SectionTitle>선택된 이미지</SectionTitle>
            <SelectedImage src={selectedImageUrl} alt="선택된 이미지" />
          </SelectedImageSection>
        )}

        {/* 이미지 번역 컴포넌트 */}
        {selectedImageUrl && (
          <TranslationSection>
            <SectionTitle>번역 설정</SectionTitle>
            <SmartImageTranslator
              imageUrl={selectedImageUrl}
              onTranslationComplete={handleTranslationComplete}
              showTranslateButton={true}
            />
          </TranslationSection>
        )}

        {/* API 명세서 정보 */}
        <ApiInfoSection>
          <SectionTitle>API 명세서 정보</SectionTitle>
          <ApiInfoGrid>
            <ApiInfoCard>
              <ApiInfoTitle>엔드포인트</ApiInfoTitle>
              <ApiInfoContent>POST /api/translate</ApiInfoContent>
            </ApiInfoCard>
            <ApiInfoCard>
              <ApiInfoTitle>인증</ApiInfoTitle>
              <ApiInfoContent>불필요</ApiInfoContent>
            </ApiInfoCard>
            <ApiInfoCard>
              <ApiInfoTitle>지원 언어</ApiInfoTitle>
              <ApiInfoContent>11개 언어 (KOREAN, ENGLISH, JAPANESE, CHINESE, FRENCH, ARABIC, VIETNAMESE, THAI, ITALIAN, SPANISH, GERMAN)</ApiInfoContent>
            </ApiInfoCard>
            <ApiInfoCard>
              <ApiInfoTitle>처리 모드</ApiInfoTitle>
              <ApiInfoContent>AUTO (자동 판별), MENU (메뉴판 강제), IMAGE (일반 강제)</ApiInfoContent>
            </ApiInfoCard>
          </ApiInfoGrid>
        </ApiInfoSection>

        {/* 구현된 기능 목록 */}
        <FeaturesSection>
          <SectionTitle>구현된 기능</SectionTitle>
          <FeaturesList>
            <FeatureItem>✅ API 명세서에 맞는 엔드포인트 구현</FeatureItem>
            <FeatureItem>✅ 11개 지원 언어 선택 옵션</FeatureItem>
            <FeatureItem>✅ 방법 1: 한국어 선택 시 버튼 비활성화</FeatureItem>
            <FeatureItem>✅ 메뉴판/일반 이미지 자동 판별</FeatureItem>
            <FeatureItem>✅ 구조화된 메뉴 항목 표시</FeatureItem>
            <FeatureItem>✅ 일반 텍스트 번역 표시</FeatureItem>
            <FeatureItem>✅ 번역 결과 클립보드 복사</FeatureItem>
            <FeatureItem>✅ 에러 처리 및 사용자 알림</FeatureItem>
            <FeatureItem>✅ 백엔드 연동 준비 (주석 처리)</FeatureItem>
          </FeaturesList>
        </FeaturesSection>
      </MainContent>

      <Footer />
    </Container>
  );
};

export default ImageTranslationTest;

// 스타일 컴포넌트들
const Container = styled.div`
  width: 100%;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 80px auto 0;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  color: #262626;
  text-align: center;
  margin: 0 0 1rem 0;
`;

const Subtitle = styled.p`
  font-size: 1.6rem;
  color: #666;
  text-align: center;
  margin: 0 0 3rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: #262626;
  margin: 0 0 1.5rem 0;
`;

const ImageSelectionSection = styled.div`
  margin-bottom: 3rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ImageCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid ${props => props.isSelected ? '#FEE502' : 'transparent'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
`;

const ImageInfo = styled.div`
  padding: 1.5rem;
`;

const ImageName = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #262626;
  margin: 0 0 0.5rem 0;
`;

const ImageDescription = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0;
`;

const SelectedImageSection = styled.div`
  margin-bottom: 3rem;
  text-align: center;
`;

const SelectedImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const TranslationSection = styled.div`
  margin-bottom: 3rem;
`;

const ApiInfoSection = styled.div`
  margin-bottom: 3rem;
`;

const ApiInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ApiInfoCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ApiInfoTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: #262626;
  margin: 0 0 0.5rem 0;
`;

const ApiInfoContent = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

const FeaturesSection = styled.div`
  margin-bottom: 3rem;
`;

const FeaturesList = styled.ul`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FeatureItem = styled.li`
  font-size: 1.6rem;
  color: #262626;
  margin-bottom: 1rem;
  line-height: 1.5;
  
  &:last-child {
    margin-bottom: 0;
  }
`;
