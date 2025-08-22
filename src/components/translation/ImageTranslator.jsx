import React, { useState } from 'react';
import styled from 'styled-components';
import ApiService from '../../services/api';

const LANGUAGES = [
  { code: 'en', label: '영어', flag: '🇺🇸' },
  { code: 'ja', label: '일본어', flag: '🇯🇵' },
  { code: 'zh', label: '중국어', flag: '🇨🇳' },
  { code: 'es', label: '스페인어', flag: '🇪🇸' },
  { code: 'fr', label: '프랑스어', flag: '🇫🇷' },
  { code: 'de', label: '독일어', flag: '🇩🇪' },
  { code: 'ru', label: '러시아어', flag: '🇷🇺' },
  { code: 'ar', label: '아랍어', flag: '🇸🇦' },
];

function ImageTranslator({ imageUrl, menuText, isVisible, onClose }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (!menuText || !selectedLanguage) return;

    setIsTranslating(true);
    setError(null);

    try {
      const response = await ApiService.translateText(menuText, selectedLanguage);
      setTranslatedText(response.translatedText || response.text);
    } catch (err) {
      console.error('Translation failed:', err);
      setError('번역에 실패했습니다. 다시 시도해주세요.');
      
      // 임시 더미 번역 (API 실패 시)
      const dummyTranslations = {
        en: 'Bulgogi Bibimbap - Mixed rice with marinated beef',
        ja: 'プルコギビビンバ - 甘辛い牛肉と野菜の混ぜご飯',
        zh: '烤肉拌饭 - 腌制牛肉拌饭',
        es: 'Bulgogi Bibimbap - Arroz mixto con carne marinada',
        fr: 'Bulgogi Bibimbap - Riz mélangé avec du bœuf mariné',
        de: 'Bulgogi Bibimbap - Gemischter Reis mit mariniertem Rindfleisch',
        ru: 'Булгоги Пибимпап - Смешанный рис с маринованной говядиной',
        ar: 'بولغوغي بيبيمباب - أرز مختلط مع لحم البقر المتبل'
      };
      setTranslatedText(dummyTranslations[selectedLanguage] || 'Translation not available');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
    setTranslatedText('');
    setError(null);
  };

  if (!isVisible) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>🌐 메뉴 번역</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalContent>
          {imageUrl && (
            <ImageSection>
              <MenuImage src={imageUrl} alt="메뉴 이미지" />
            </ImageSection>
          )}

          <TranslationSection>
            <SectionTitle>원문</SectionTitle>
            <OriginalText>{menuText || '메뉴 정보가 없습니다.'}</OriginalText>

            <SectionTitle>번역할 언어 선택</SectionTitle>
            <LanguageGrid>
              {LANGUAGES.map((lang) => (
                <LanguageButton
                  key={lang.code}
                  selected={selectedLanguage === lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  <LanguageFlag>{lang.flag}</LanguageFlag>
                  <LanguageLabel>{lang.label}</LanguageLabel>
                </LanguageButton>
              ))}
            </LanguageGrid>

            <ActionSection>
              <TranslateButton 
                onClick={handleTranslate}
                disabled={isTranslating || !menuText}
              >
                {isTranslating ? '번역 중...' : '번역하기'}
              </TranslateButton>
            </ActionSection>

            {error && (
              <ErrorMessage>{error}</ErrorMessage>
            )}

            {translatedText && (
              <ResultSection>
                <SectionTitle>번역 결과</SectionTitle>
                <TranslatedText>{translatedText}</TranslatedText>
                <CopyButton onClick={() => navigator.clipboard.writeText(translatedText)}>
                  📋 복사하기
                </CopyButton>
              </ResultSection>
            )}
          </TranslationSection>
        </ModalContent>
      </Modal>
    </Overlay>
  );
}

export default ImageTranslator;

// ===== styled =====
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #262626;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2.4rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #f3f4f6;
    color: #262626;
  }
`;

const ModalContent = styled.div`
  padding: 2rem;
`;

const ImageSection = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const MenuImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const TranslationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: #262626;
  margin: 0;
`;

const OriginalText = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.4rem;
  color: #262626;
  line-height: 1.6;
  border: 1px solid #e5e7eb;
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const LanguageButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#FEE502' : '#e5e7eb'};
  border-radius: 10px;
  background: ${props => props.selected ? '#FFF9C4' : 'white'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #FEE502;
    transform: translateY(-2px);
  }
`;

const LanguageFlag = styled.div`
  font-size: 2rem;
`;

const LanguageLabel = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #262626;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
`;

const TranslateButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 10px;
  padding: 1.2rem 2.4rem;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #ffe95a;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.4rem;
  text-align: center;
`;

const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TranslatedText = styled.div`
  background: #f0fdf4;
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.4rem;
  color: #166534;
  line-height: 1.6;
  border: 1px solid #bbf7d0;
`;

const CopyButton = styled.button`
  background: white;
  color: #166534;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    background: #f0fdf4;
  }
`;