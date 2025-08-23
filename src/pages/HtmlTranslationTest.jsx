import React, { useState } from 'react';
import styled from 'styled-components';
import HtmlTranslator from '../components/translation/HtmlTranslator';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const HtmlTranslationTest = () => {
  const [selectedHtmlTemplate, setSelectedHtmlTemplate] = useState('');
  const [translationResult, setTranslationResult] = useState(null);

  // 테스트용 HTML 템플릿들
  const htmlTemplates = [
    {
      name: '기본 메뉴판',
      html: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <title>메뉴판</title>
</head>
<body>
    <header>
        <h1>안녕하세요, 민어 테스트입니다!</h1>
        <nav>
            <ul>
                <li><a href="/intro">소개</a></li>
                <li><a href="/feature">기능</a></li>
                <li><a href="#contact">문의</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section id="intro">
            <h2>피스 조 소개</h2>
            <p><strong>이미지? API</strong> 미드 시민니다.</p>
        </section>
        <section id="feature">
            <h3>카페 문화를 사랑하는 이들을 위한 공간.</h3>
            <p>신진 디자이너들의 작품을 직접 보고 구매.</p>
            <ul>
                <li><a href="#">이벤트</a></li>
                <li><a href="#">공지사항</a></li>
                <li><a href="#">고객센터</a></li>
            </ul>
        </section>
        <section id="contact">
            <h4>문의하기</h4>
            <p>이메일: <a href="mailto:test@example.com">test@example.com</a></p>
            <p>주소: 서울시 마포구 홍대입구역 123-45</p>
            <p>전화: 02-1234-5678</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2025 테스트 회사. 모든 권리 보유.</p>
    </footer>
</body>
</html>`
    },
    {
      name: '복잡한 HTML 구조',
      html: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>샘플 페이지</title>
</head>
<body>
    <header>
        <h1>안녕하세요, 번역 테스트입니다!</h1>
        <nav>
            <ul>
                <li><a href="#intro">소개</a></li>
                <li><a href="#features">특징</a></li>
                <li><a href="#contact">문의</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section id="intro">
            <h2>서비스 소개</h2>
            <p>이 페이지는 <strong>구글 번역 API</strong> 활용한 <em>HTML 번역 테스트</em>용 예시입니다.</p>
        </section>
        <section id="features">
            <h2>주요 특징</h2>
            <ul>
                <li>HTML 태그 보증</li>
                <li>다국어 지원</li>
                <li>빠른 응답 속도</li>
            </ul>
            <table border="1">
                <thead>
                    <tr>
                        <th>언어</th>
                        <th>코드</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>영어</td>
                        <td>en</td>
                    </tr>
                    <tr>
                        <td>프랑스어</td>
                        <td>fr</td>
                    </tr>
                    <tr>
                        <td>일본어</td>
                        <td>ja</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <section id="contact">
            <h2>문의하기</h2>
            <p>자세한 사항은 <a href="mailto:test@example.com">이메일</a>로 연락해주세요.</p>
            <img src="logo.png" alt="회사 로고" />
        </section>
    </main>
    <footer>
        <p>&copy; 2025 테스트 회사. 모든 권리 보유.</p>
    </footer>
</body>
</html>`
    },
    {
      name: '간단한 HTML',
      html: `<!DOCTYPE html>
<html>
<body>
    <h1>안녕하세요</h1>
    <p>오늘 날씨가 좋아요.</p>
    <p>메뉴판을 확인해보세요.</p>
</body>
</html>`
    }
  ];

  const handleHtmlSelect = (html) => {
    setSelectedHtmlTemplate(html);
    setTranslationResult(null);
  };

  const handleTranslationComplete = (result) => {
    setTranslationResult(result);
    console.log('HTML 번역 완료:', result);
  };

  return (
    <Container>
      <Header />
      
      <MainContent>
        <Title>HTML 번역 테스트</Title>
        <Subtitle>API 명세서에 맞는 HTML 번역 기능을 테스트해보세요</Subtitle>

        {/* HTML 템플릿 선택 */}
        <TemplateSelectionSection>
          <SectionTitle>HTML 템플릿 선택</SectionTitle>
          <TemplateGrid>
            {htmlTemplates.map((template, index) => (
              <TemplateCard 
                key={index}
                onClick={() => handleHtmlSelect(template.html)}
                isSelected={selectedHtmlTemplate === template.html}
              >
                <TemplateInfo>
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateDescription>
                    {template.html.length > 100 
                      ? `${template.html.substring(0, 100)}...` 
                      : template.html
                    }
                  </TemplateDescription>
                </TemplateInfo>
              </TemplateCard>
            ))}
          </TemplateGrid>
        </TemplateSelectionSection>

        {/* 선택된 HTML 표시 */}
        {selectedHtmlTemplate && (
          <SelectedHtmlSection>
            <SectionTitle>선택된 HTML</SectionTitle>
            <HtmlPreview>
              <HtmlCode>{selectedHtmlTemplate}</HtmlCode>
            </HtmlPreview>
          </SelectedHtmlSection>
        )}

        {/* HTML 번역 컴포넌트 */}
        {selectedHtmlTemplate && (
          <TranslationSection>
            <SectionTitle>번역 설정</SectionTitle>
            <HtmlTranslator
              originalHtml={selectedHtmlTemplate}
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
              <ApiInfoContent>POST /api/translate/html/raw</ApiInfoContent>
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
              <ApiInfoTitle>특별 처리</ApiInfoTitle>
              <ApiInfoContent>target=KOREAN일 경우 원문 그대로 반환 (요금 방지)</ApiInfoContent>
            </ApiInfoCard>
          </ApiInfoGrid>
        </ApiInfoSection>

        {/* 구현된 기능 목록 */}
        <FeaturesSection>
          <SectionTitle>구현된 기능</SectionTitle>
          <FeaturesList>
            <FeatureItem>✅ API 명세서에 맞는 엔드포인트 구현</FeatureItem>
            <FeatureItem>✅ 11개 지원 언어 선택 옵션</FeatureItem>
            <FeatureItem>✅ 최초 HTML 원문 프론트엔드 보관</FeatureItem>
            <FeatureItem>✅ 다시 한국어 버튼 클릭 시 원문 그대로 렌더링</FeatureItem>
            <FeatureItem>✅ 번역 보기 버튼 클릭 시 API 호출</FeatureItem>
            <FeatureItem>✅ HTML 태그 구조 보존</FeatureItem>
            <FeatureItem>✅ HTML 코드 및 렌더링 미리보기</FeatureItem>
            <FeatureItem>✅ 번역 결과 클립보드 복사</FeatureItem>
            <FeatureItem>✅ 에러 처리 및 사용자 알림</FeatureItem>
            <FeatureItem>✅ 백엔드 연동 준비 (주석 처리)</FeatureItem>
          </FeaturesList>
        </FeaturesSection>

        {/* 프론트엔드 연동 가이드 */}
        <GuideSection>
          <SectionTitle>프론트엔드 연동 가이드</SectionTitle>
          <GuideContent>
            <GuideItem>
              <GuideNumber>1.</GuideNumber>
              <GuideText>최초 HTML 원문을 프론트에서 보관</GuideText>
            </GuideItem>
            <GuideItem>
              <GuideNumber>2.</GuideNumber>
              <GuideText>"다시 한국어" 버튼 클릭 시 → 백엔드 호출 X, 원문 그대로 렌더</GuideText>
            </GuideItem>
            <GuideItem>
              <GuideNumber>3.</GuideNumber>
              <GuideText>번역 보기 버튼 클릭 시 → 백엔드 /api/translate/html/raw 호출 후 반환 HTML 렌더</GuideText>
            </GuideItem>
          </GuideContent>
        </GuideSection>
      </MainContent>

      <Footer />
    </Container>
  );
};

export default HtmlTranslationTest;

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

const TemplateSelectionSection = styled.div`
  margin-bottom: 3rem;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TemplateCard = styled.div`
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

const TemplateInfo = styled.div`
  padding: 1.5rem;
`;

const TemplateName = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #262626;
  margin: 0 0 0.5rem 0;
`;

const TemplateDescription = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
  font-family: monospace;
`;

const SelectedHtmlSection = styled.div`
  margin-bottom: 3rem;
`;

const HtmlPreview = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const HtmlCode = styled.pre`
  background: #2d3748;
  color: #e2e8f0;
  padding: 1.5rem;
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
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

const GuideSection = styled.div`
  margin-bottom: 3rem;
`;

const GuideContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const GuideItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const GuideNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #FEE502;
  background: #262626;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const GuideText = styled.p`
  font-size: 1.6rem;
  color: #262626;
  margin: 0;
  line-height: 1.5;
`;
