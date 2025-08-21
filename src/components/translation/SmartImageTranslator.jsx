import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import ApiService from '../../utils/apiService'; // 백엔드 배포 시 사용

const SmartImageTranslator = ({ 
  imageUrl, 
  onTranslationComplete,
  showTranslateButton = true 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('ENGLISH');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const [error, setError] = useState(null);

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

  // 한국어 선택 여부 확인 (방법 1: 버튼 비활성화)
  const isKoreanSelected = selectedLanguage === 'KOREAN';

  const handleTranslate = async () => {
    if (isKoreanSelected) {
      // 한국어 선택 시 API 호출하지 않음 (방법 1)
      alert('기본 언어는 번역이 필요 없습니다.');
      return;
    }

    setIsTranslating(true);
    setError(null);
    setTranslationResult(null);

    try {
      // ===== 현재 더미 데이터 버전 (실제 사용 중) =====
      // API 명세서에 맞는 더미 응답 생성
      const dummyResponse = generateDummyTranslationResponse(selectedLanguage);
      setTranslationResult(dummyResponse);
      
      if (onTranslationComplete) {
        onTranslationComplete(dummyResponse);
      }

      // ===== 백엔드 배포 시 API 버전 (주석처리) =====
      /*
      const response = await ApiService.translateImage(imageUrl, selectedLanguage, 'AUTO');
      
      if (response.success) {
        setTranslationResult(response.data);
        if (onTranslationComplete) {
          onTranslationComplete(response.data);
        }
      } else {
        throw new Error(response.message || '번역에 실패했습니다.');
      }
      */
    } catch (error) {
      console.error('번역 요청 실패:', error.message);
      setError(error.message);
      
      // 에러 메시지 표시 (API 명세서에 따른 예외 처리)
      alert(error.message);
    } finally {
      setIsTranslating(false);
    }
  };

  // API 명세서에 맞는 더미 응답 생성
  const generateDummyTranslationResponse = (targetLang) => {
    const isMenu = Math.random() > 0.5; // 50% 확률로 메뉴판으로 판별
    
    if (isMenu) {
      // 메뉴판으로 판별된 경우
      return {
        mode: 'menu',
        score: 0.69,
        menuItems: [
          {
            section: '대표메뉴',
            originalName: '해물칼국수',
            translatedName: getTranslatedMenuName('해물칼국수', targetLang),
            price: '14,000원',
            option: ''
          },
          {
            section: '대표메뉴',
            originalName: '비빔칼국수',
            translatedName: getTranslatedMenuName('비빔칼국수', targetLang),
            price: '9,000원',
            option: ''
          }
        ],
        normal: null
      };
    } else {
      // 일반 이미지로 판별된 경우
      return {
        mode: 'normal',
        score: 0.22,
        menuItems: null,
        normal: {
          translatedText: getTranslatedText(targetLang)
        }
      };
    }
  };

  // 메뉴명 번역 (더미 데이터)
  const getTranslatedMenuName = (originalName, targetLang) => {
    const translations = {
      '해물칼국수': {
        'ENGLISH': 'Seafood Kalguksu',
        'JAPANESE': 'シーフードカルグクス',
        'CHINESE': '海鲜刀削面',
        'FRENCH': 'Kalguksu aux fruits de mer',
        'SPANISH': 'Kalguksu de mariscos',
        'GERMAN': 'Meeresfrüchte-Kalguksu'
      },
      '비빔칼국수': {
        'ENGLISH': 'Bibim Kalguksu',
        'JAPANESE': 'ビビムカルグクス',
        'CHINESE': '拌刀削面',
        'FRENCH': 'Kalguksu bibim',
        'SPANISH': 'Kalguksu bibim',
        'GERMAN': 'Bibim-Kalguksu'
      }
    };
    
    return translations[originalName]?.[targetLang] || originalName;
  };

  // 일반 텍스트 번역 (더미 데이터)
  const getTranslatedText = (targetLang) => {
    const translations = {
      'ENGLISH': 'This is a sample translated text for demonstration purposes.',
      'JAPANESE': 'これはデモンストレーション用のサンプル翻訳テキストです。',
      'CHINESE': '这是用于演示的示例翻译文本。',
      'FRENCH': 'Ceci est un exemple de texte traduit à des fins de démonstration.',
      'SPANISH': 'Este es un texto traducido de ejemplo para fines de demostración.',
      'GERMAN': 'Dies ist ein Beispielübersetzungstext für Demonstrationszwecke.'
    };
    
    return translations[targetLang] || 'Translation not available';
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    setTranslationResult(null);
    setError(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('클립보드에 복사되었습니다!');
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

      {/* 번역 버튼 (방법 1: 한국어 선택 시 비활성화) */}
      {showTranslateButton && (
        <TranslateButton
          onClick={handleTranslate}
          disabled={isKoreanSelected || isTranslating}
          isKoreanSelected={isKoreanSelected}
        >
          {isTranslating ? '번역 중...' : '번역하기'}
        </TranslateButton>
      )}

      {/* 한국어 선택 시 안내 메시지 */}
      {isKoreanSelected && (
        <KoreanWarning>
          ⚠️ 기본 언어는 번역이 필요 없습니다.
        </KoreanWarning>
      )}

      {/* 에러 메시지 */}
      {error && (
        <ErrorMessage>
          ❌ {error}
        </ErrorMessage>
      )}

      {/* 번역 결과 */}
      {translationResult && (
        <ResultSection>
          <ResultTitle>
            번역 결과 
            {translationResult.mode === 'menu' ? ' (메뉴판)' : ' (일반 이미지)'}
          </ResultTitle>
          
          {translationResult.mode === 'menu' && translationResult.menuItems && (
            <MenuResult>
              <MenuTitle>메뉴 항목:</MenuTitle>
              {translationResult.menuItems.map((item, index) => (
                <MenuItem key={index}>
                  <MenuSection>{item.section}</MenuSection>
                  <MenuName>
                    <OriginalName>{item.originalName}</OriginalName>
                    <TranslatedName>{item.translatedName}</TranslatedName>
                  </MenuName>
                  <MenuPrice>{item.price}</MenuPrice>
                  <MenuOption>{item.option}</MenuOption>
                </MenuItem>
              ))}
              <CopyButton onClick={() => copyToClipboard(
                translationResult.menuItems.map(item => 
                  `${item.translatedName} - ${item.price}`
                ).join('\n')
              )}>
                📋 메뉴 복사
              </CopyButton>
            </MenuResult>
          )}
          
          {translationResult.mode === 'normal' && translationResult.normal && (
            <NormalResult>
              <NormalTitle>번역된 텍스트:</NormalTitle>
              <NormalText>{translationResult.normal.translatedText}</NormalText>
              <CopyButton onClick={() => copyToClipboard(translationResult.normal.translatedText)}>
                📋 텍스트 복사
              </CopyButton>
            </NormalResult>
          )}
        </ResultSection>
      )}
    </Container>
  );
};

export default SmartImageTranslator;

// 스타일 컴포넌트들
const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
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

const TranslateButton = styled.button`
  width: 100%;
  padding: 1.2rem;
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

const KoreanWarning = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  color: #856404;
  font-size: 1.4rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
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

const ResultTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const MenuResult = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MenuTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const MenuItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const MenuSection = styled.div`
  font-size: 1.2rem;
  color: #666;
  font-weight: 500;
`;

const MenuName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OriginalName = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
`;

const TranslatedName = styled.div`
  font-size: 1.2rem;
  color: #007bff;
  font-weight: 500;
`;

const MenuPrice = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: #28a745;
  text-align: center;
`;

const MenuOption = styled.div`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
`;

const NormalResult = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NormalTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const NormalText = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 1.4rem;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
`;

const CopyButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
  }
`;
