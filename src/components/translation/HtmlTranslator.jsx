import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
// import ApiService from '../../utils/apiService'; // 백엔드 배포 시 사용

const HtmlTranslator = ({ 
  originalHtml, 
  onTranslationComplete,
  showTranslateButton = true 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('ENGLISH');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedHtml, setTranslatedHtml] = useState('');
  const [error, setError] = useState(null);
  const [isShowingOriginal, setIsShowingOriginal] = useState(false);
  
  // 최초 HTML 원문 보관 (프론트엔드에서 보관)
  const originalHtmlRef = useRef(originalHtml);

  // API 명세서에 맞는 지원 언어 목록
  const supportedLanguages = [
    { code: 'KOREAN', name: '한국어', flag: '🇰🇷' },
    { code: 'ENGLISH', name: 'English', flag: '🇺🇸' },
    { code: 'JAPANESE', name: '日本語', flag: '🇯🇵' },
    { code: 'CHINESE', name: '中文', flag: '🇨🇳' },
    { code: 'FRENCH', name: 'Français', flag: '🇫🇷' },
    { code: 'ARABIC', name: 'العربية', flag: '🇸🇦' },
    { code: 'VIETNAMESE', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'THAI', name: 'ไทย', flag: '🇹🇭' },
    { code: 'ITALIAN', name: 'Italiano', flag: '🇮🇹' },
    { code: 'SPANISH', name: 'Español', flag: '🇪🇸' },
    { code: 'GERMAN', name: 'Deutsch', flag: '🇩🇪' }
  ];

  // 한국어 선택 여부 확인
  const isKoreanSelected = selectedLanguage === 'KOREAN';

  // 언어 변경 시 처리
  useEffect(() => {
    if (isKoreanSelected) {
      // 한국어 선택 시 원문 그대로 렌더링 (백엔드 호출 X)
      setTranslatedHtml(originalHtmlRef.current);
      setIsShowingOriginal(true);
      if (onTranslationComplete) {
        onTranslationComplete(originalHtmlRef.current);
      }
    } else {
      setIsShowingOriginal(false);
    }
  }, [selectedLanguage, isKoreanSelected, onTranslationComplete]);

  const handleTranslate = async () => {
    if (isKoreanSelected) {
      // 한국어 선택 시 이미 원문이 표시됨
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      // ===== 현재 더미 데이터 버전 (실제 사용 중) =====
      // API 명세서에 맞는 더미 HTML 번역 생성
      const dummyTranslatedHtml = generateDummyTranslatedHtml(originalHtmlRef.current, selectedLanguage);
      setTranslatedHtml(dummyTranslatedHtml);
      
      if (onTranslationComplete) {
        onTranslationComplete(dummyTranslatedHtml);
      }

      // ===== 백엔드 배포 시 API 버전 (주석처리) =====
      /*
      const translatedHtmlResult = await ApiService.translateHtml(originalHtmlRef.current, selectedLanguage);
      setTranslatedHtml(translatedHtmlResult);
      
      if (onTranslationComplete) {
        onTranslationComplete(translatedHtmlResult);
      }
      */
    } catch (error) {
      console.error('HTML 번역 요청 실패:', error.message);
      setError(error.message);
      alert(error.message);
    } finally {
      setIsTranslating(false);
    }
  };

  // 더미 HTML 번역 생성 (API 명세서에 맞는 응답 시뮬레이션)
  const generateDummyTranslatedHtml = (originalHtml, targetLang) => {
    // 간단한 한국어 텍스트 번역 매핑
    const translations = {
      '안녕하세요': {
        'ENGLISH': 'Hello',
        'JAPANESE': 'こんにちは',
        'CHINESE': '你好',
        'FRENCH': 'Bonjour',
        'SPANISH': 'Hola',
        'GERMAN': 'Hallo'
      },
      '메뉴판': {
        'ENGLISH': 'Menu',
        'JAPANESE': 'メニュー',
        'CHINESE': '菜单',
        'FRENCH': 'Menu',
        'SPANISH': 'Menú',
        'GERMAN': 'Speisekarte'
      },
      '소개': {
        'ENGLISH': 'Introduction',
        'JAPANESE': '紹介',
        'CHINESE': '介绍',
        'FRENCH': 'Introduction',
        'SPANISH': 'Introducción',
        'GERMAN': 'Einführung'
      },
      '기능': {
        'ENGLISH': 'Features',
        'JAPANESE': '機能',
        'CHINESE': '功能',
        'FRENCH': 'Fonctionnalités',
        'SPANISH': 'Características',
        'GERMAN': 'Funktionen'
      },
      '문의': {
        'ENGLISH': 'Contact',
        'JAPANESE': 'お問い合わせ',
        'CHINESE': '联系',
        'FRENCH': 'Contact',
        'SPANISH': 'Contacto',
        'GERMAN': 'Kontakt'
      }
    };

    let translatedHtml = originalHtml;
    
    // 한국어 텍스트를 번역된 텍스트로 교체
    Object.keys(translations).forEach(koreanText => {
      const translatedText = translations[koreanText][targetLang] || koreanText;
      const regex = new RegExp(koreanText, 'g');
      translatedHtml = translatedHtml.replace(regex, translatedText);
    });

    return translatedHtml;
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    setError(null);
  };

  const handleShowOriginal = () => {
    // 다시 한국어 버튼 클릭 시 → 백엔드 호출 X, 원문 그대로 렌더
    setTranslatedHtml(originalHtmlRef.current);
    setIsShowingOriginal(true);
    if (onTranslationComplete) {
      onTranslationComplete(originalHtmlRef.current);
    }
  };

  const handleShowTranslation = () => {
    // 번역 보기 버튼 클릭 시 → 백엔드 /api/translate/html/raw 호출 후 반환 HTML 렌더
    handleTranslate();
  };

  const copyToClipboard = (html) => {
    navigator.clipboard.writeText(html);
    alert('HTML이 클립보드에 복사되었습니다!');
  };

  return (
    <Container>
      {/* 언어 선택 */}
      <LanguageSection>
        <LanguageLabel>번역 언어 선택:</LanguageLabel>
        <LanguageSelect 
          value={selectedLanguage} 
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </LanguageSelect>
      </LanguageSection>

      {/* 번역 버튼들 */}
      {showTranslateButton && (
        <ButtonSection>
          <TranslateButton
            onClick={handleShowTranslation}
            disabled={isKoreanSelected || isTranslating}
            isKoreanSelected={isKoreanSelected}
          >
            {isTranslating ? '번역 중...' : '번역 보기'}
          </TranslateButton>
          
          <OriginalButton
            onClick={handleShowOriginal}
            disabled={isTranslating}
          >
            다시 한국어
          </OriginalButton>
        </ButtonSection>
      )}

      {/* 한국어 선택 시 안내 메시지 */}
      {isKoreanSelected && (
        <KoreanWarning>
          ⚠️ 기본 언어는 번역이 필요 없습니다. 원문이 그대로 표시됩니다.
        </KoreanWarning>
      )}

      {/* 에러 메시지 */}
      {error && (
        <ErrorMessage>
          ❌ {error}
        </ErrorMessage>
      )}

      {/* 번역 결과 */}
      {(translatedHtml || isShowingOriginal) && (
        <ResultSection>
          <ResultHeader>
            <ResultTitle>
              {isShowingOriginal ? '원문 HTML' : '번역된 HTML'}
            </ResultTitle>
            <CopyButton onClick={() => copyToClipboard(translatedHtml || originalHtmlRef.current)}>
              📋 HTML 복사
            </CopyButton>
          </ResultHeader>
          
          <HtmlPreview>
            <HtmlCode>
              {translatedHtml || originalHtmlRef.current}
            </HtmlCode>
          </HtmlPreview>
          
          <RenderedPreview>
            <PreviewTitle>렌더링 미리보기:</PreviewTitle>
            <PreviewContent 
              dangerouslySetInnerHTML={{ 
                __html: translatedHtml || originalHtmlRef.current 
              }} 
            />
          </RenderedPreview>
        </ResultSection>
      )}
    </Container>
  );
};

export default HtmlTranslator;

// 스타일 컴포넌트들
const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const LanguageSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const LanguageLabel = styled.label`
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
`;

const LanguageSelect = styled.select`
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1.4rem;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #FEE502;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TranslateButton = styled.button`
  padding: 1.2rem 2rem;
  background-color: ${props => props.isKoreanSelected ? '#ccc' : '#FEE502'};
  color: ${props => props.isKoreanSelected ? '#666' : '#262626'};
  border: none;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: ${props => props.isKoreanSelected ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: #E6CF00;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
  }
`;

const OriginalButton = styled.button`
  padding: 1.2rem 2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
  }
`;

const KoreanWarning = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  color: #856404;
  font-size: 1.4rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  font-size: 1.4rem;
`;

const ResultSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ResultTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CopyButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #218838;
    transform: translateY(-1px);
  }
`;

const HtmlPreview = styled.div`
  margin-bottom: 2rem;
`;

const HtmlCode = styled.pre`
  background: #2d3748;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.2rem;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
`;

const RenderedPreview = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const PreviewTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
`;

const PreviewContent = styled.div`
  padding: 1.5rem;
  background: white;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  
  /* HTML 렌더링 스타일 */
  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 1rem 0;
    color: #333;
  }
  
  p {
    margin: 0 0 1rem 0;
    line-height: 1.6;
  }
  
  ul, ol {
    margin: 0 0 1rem 0;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  a {
    color: #007bff;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
  }
  
  th {
    background-color: #f8f9fa;
  }
`;
