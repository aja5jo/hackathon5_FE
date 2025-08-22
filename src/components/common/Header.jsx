import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const navigate = useNavigate();
  
  const { isAuthenticated, isMerchant, user, logout } = useAuth();
  
  const [selectedLanguage, setSelectedLanguage] = useState('KOREAN');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [currentTexts, setCurrentTexts] = useState({});

  // 디버깅용 로그


  // 언어 설정 - API 명세서에 맞는 SupportedLanguage enum 값 사용
  const languages = [
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

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  useEffect(() => {
    updateTexts();
  }, [selectedLanguage]);

  const updateTexts = () => {
    setCurrentTexts({
      categories: '카테고리',
      events: '이벤트',
      popup: '팝업',
      bucketlist: '버킷리스트',
      login: '로그인',
      logout: '로그아웃'
    });
  };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
    
    // localStorage에 선택된 언어 저장
    localStorage.setItem('translator:selected', languageCode);
    
    // 커스텀 이벤트 발행 (본문 번역과 동기화)
    window.dispatchEvent(new CustomEvent('translator:languageChanged', { 
      detail: languageCode 
    }));
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };
  
  // 마이페이지 클릭 핸들러 - 사용자 유형에 따라 다른 페이지로 이동
  const handleMyPageClick = () => {
    if (isMerchant) {
      navigate('/merchants/mypage');
    } else {
      navigate('/mypage');
    }
  };

  // 즐겨찾기 클릭 핸들러 - 로그인 상태 확인
  const handleFavoritesClick = () => {
    if (!isAuthenticated) {
      alert('즐겨찾기 기능을 사용하려면 로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/favorites');
  };
  
  return (
    <HeaderContainer>
      <Left>
        <Logo src = {logo} alt="로고" onClick = { ()=> navigate('/')}/>
        <Nav>
          <NavItem onClick ={()=>navigate('/categories')}>카테고리</NavItem>
          <NavItem onClick ={()=>navigate('/events')}>이벤트</NavItem>
          <NavItem onClick ={()=>navigate('/popup')}>팝업</NavItem>
          <NavItem onClick={handleFavoritesClick}>버킷리스트</NavItem>
          {/* 로그인 상태에 따른 마이페이지 조건부 렌더링 */}
          {isAuthenticated && (
            <NavItem onClick={handleMyPageClick}>마이페이지</NavItem>
          )}
        </Nav>
      </Left>
      <Right>
        <LanguageSelector>
          <LanguageButton 
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          >
            <LanguageFlag>{currentLanguage.flag}</LanguageFlag>
            <LanguageName>{currentLanguage.name}</LanguageName>
            <DropdownArrow $isOpen={isLanguageDropdownOpen}>▼</DropdownArrow>
          </LanguageButton>
          
          {isLanguageDropdownOpen && (
            <LanguageDropdown>
              {languages.map((language) => (
                <LanguageOption
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  isSelected={language.code === selectedLanguage}
                >
                  <LanguageFlag>{language.flag}</LanguageFlag>
                  <LanguageName>{language.name}</LanguageName>
                  {language.code === selectedLanguage && <CheckMark>✓</CheckMark>}
                </LanguageOption>
              ))}
            </LanguageDropdown>
          )}
        </LanguageSelector>
        {/* ===== 로그인/로그아웃 버튼 조건부 렌더링 ===== */}
        {isAuthenticated ? (
          // 로그인된 상태: 사용자 정보 + 로그아웃 버튼 표시
          <UserSection>
            <UserInfo>
              {user?.email || '사용자'}
            </UserInfo>
            <LogoutButton onClick={handleLogoutClick}>로그아웃</LogoutButton>
          </UserSection>
        ) : (
          // 로그인되지 않은 상태: 로그인 버튼 표시
          <LoginButton onClick={handleLoginClick}>로그인</LoginButton>
        )}
        {/* ===== 로그인/로그아웃 버튼 끝 ===== */}
      </Right>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 999;
  border-bottom: 1px solid #E5E5E5;
  background: #FFF;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;


const Logo = styled.img`
  height:30px ;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavItem = styled.span`
  cursor: pointer;
  font-size: 1.6rem;
`;

const LoginButton = styled.span`
  cursor: pointer;
  font-size: 1.6rem;
  color: #FF6B35; // 오렌지색으로 변경
  font-weight: 600; // 굵게 표시
  
  &:hover {
    text-decoration: underline; // 호버 시 밑줄 표시
  }
`;

// ===== 새로 추가된 스타일 컴포넌트들 =====
const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.span`
  font-size: 1.4rem;
  color: #666;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LogoutButton = styled.span`
  cursor: pointer;
  font-size: 1.6rem;
  color: #FF6B35; // 오렌지색으로 변경
  font-weight: 600; // 굵게 표시
  
  &:hover {
    text-decoration: underline; // 호버 시 밑줄 표시
  }
`;

// ===== 언어 선택 드롭다운 스타일 =====
const LanguageSelector = styled.div`
  position: relative;
  display: inline-block;
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #E5E5E5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.4rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #FF6B35;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const LanguageFlag = styled.span`
  font-size: 1.6rem;
`;

const LanguageName = styled.span`
  font-size: 1.4rem;
  font-weight: 500;
  color: #333;
`;

const DropdownArrow = styled.span`
  font-size: 1rem;
  color: #666;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const LanguageDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #E5E5E5;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 4px;
`;

const LanguageOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  cursor: pointer;
  font-size: 1.4rem;
  transition: background-color 0.2s ease;
  background-color: ${props => props.isSelected ? '#F0F8FF' : 'white'};
  
  &:hover {
    background-color: #F8F9FA;
  }
  
  &:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  
  &:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const CheckMark = styled.span`
  color: #FF6B35;
  font-weight: bold;
  margin-left: auto;
`;
// ===== 언어 선택 드롭다운 스타일 끝 =====

// ===== 새로 추가된 스타일 컴포넌트들 끝 =====

export default Header;