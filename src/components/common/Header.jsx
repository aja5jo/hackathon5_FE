import React, { useState, useEffect } from 'react'; // useEffect 추가
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// import ToggleSwitch from './ToggleSwitch'; // 더 이상 사용하지 않음
import logo from '../../assets/logo.png'; // 로고 import 추가
import { getTranslation, getCurrentLanguage, setCurrentLanguage } from '../../utils/translations';

const Header = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(getCurrentLanguage());
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [currentTexts, setCurrentTexts] = useState({});
  
  // 언어 옵션
  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];
  
  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);
  
  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
    updateTexts(languageCode);
    // 언어 변경 이벤트 발생
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: languageCode }));
  };
  
  const updateTexts = (lang) => {
    setCurrentTexts({
      categories: getTranslation('categories', lang),
      events: getTranslation('events', lang),
      popup: getTranslation('popup', lang),
      bucketlist: getTranslation('bucketlist', lang),
      login: getTranslation('login', lang),
      logout: getTranslation('logout', lang)
    });
  };

  // ===== 로그인 상태 관리 추가 =====
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [userData, setUserData] = useState(null); // 사용자 데이터

  // ===== 수정: 로그인 상태 확인 함수 개선 =====
  const checkLoginStatus = () => {
    const hasLoggedInBefore = localStorage.getItem('hasLoggedInBefore');
    const user = sessionStorage.getItem('user');
    
    // ===== 수정: user 데이터가 있으면 로그인된 것으로 판단 =====
    if (user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };
  // ===== 수정 끝 =====

  // 컴포넌트 마운트 시 로그인 상태 확인 및 텍스트 초기화
  useEffect(() => {
    checkLoginStatus();
    updateTexts(selectedLanguage);

    // 로그인 상태 변경 이벤트 리스너 추가
    window.addEventListener('loginStatusChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, [selectedLanguage]);

  // 로그인 버튼 클릭 핸들러
  const handleLoginClick = () => {
    navigate('/login');
  };

  // ===== 수정: 로그아웃 버튼 클릭 핸들러 - API 호출 추가 =====
  const handleLogoutClick = async () => {
    try {
      // ===== 실제 API 호출 (백엔드 배포 후 주석 해제) =====
      /*
      const response = await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 기반 인증
      });

      const result = await response.json();
      
      if (!result.success) {
        console.error('로그아웃 실패:', result.message);
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
        return;
      }
      */
      // ===== 실제 API 호출 끝 =====

      // ===== 더미 로그아웃 처리 (백엔드 배포 후 삭제) =====
      console.log('더미 로그아웃 처리 중...');
      // ===== 더미 로그아웃 처리 끝 =====

      // 로그아웃 성공 시 모든 로그인 관련 데이터 삭제
      localStorage.removeItem('hasLoggedInBefore');
      localStorage.removeItem('hasSelectedCategories');
      localStorage.removeItem('selectedCategories');
      sessionStorage.removeItem('user');
      
      // 상태 초기화
      setIsLoggedIn(false);
      setUserData(null);
      
      // 로그인 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('loginStatusChanged'));
      
      // 홈으로 이동
      navigate('/');
      
      alert('로그아웃되었습니다.');
      
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };
  // ===== 수정 끝 =====
  // ===== 로그인 상태 관리 끝 =====

  return (
    <HeaderContainer>
      <Left>
        <Logo src = {logo} alt="로고" onClick = { ()=> navigate('/')}/>
        <Nav>
          <NavItem onClick ={()=>navigate('/categories')}>{currentTexts.categories}</NavItem>
          <NavItem onClick ={()=>navigate('/event')}>{currentTexts.events}</NavItem>
          <NavItem onClick ={()=>navigate('/popup')}>{currentTexts.popup}</NavItem>
          <NavItem onClick ={()=>navigate('/bucketlist')}>{currentTexts.bucketlist}</NavItem>
        </Nav>
      </Left>
      <Right>
        <LanguageSelector>
          <LanguageButton 
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          >
            <LanguageFlag>{currentLanguage.flag}</LanguageFlag>
            <LanguageName>{currentLanguage.name}</LanguageName>
            <DropdownArrow isOpen={isLanguageDropdownOpen}>▼</DropdownArrow>
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
        {isLoggedIn ? (
          // 로그인된 상태: 사용자 정보 + 로그아웃 버튼 표시
          <UserSection>
            <UserInfo>
              {userData?.email || '사용자'}
            </UserInfo>
            <LogoutButton onClick={handleLogoutClick}>{currentTexts.logout}</LogoutButton>
          </UserSection>
        ) : (
          // 로그인되지 않은 상태: 로그인 버튼 표시
          <LoginButton onClick={handleLoginClick}>{currentTexts.login}</LoginButton>
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
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
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
