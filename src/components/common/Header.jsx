import React, { useState, useEffect } from 'react'; // useEffect 추가
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ToggleSwitch from './ToggleSwitch';

const Header = () => {
  const navigate = useNavigate();
  const [isEnglish, setIsEnglish] = useState(false);
  const handleToggle = () => setIsEnglish(prev => !prev);

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

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkLoginStatus();

    // 로그인 상태 변경 이벤트 리스너 추가
    window.addEventListener('loginStatusChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

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
        <Logo src = "src/assets/logo.png" alt="로고" onClick = { ()=> navigate('/')}/>
        <Nav>
          <NavItem onClick ={()=>navigate('/categories')}>카테고리</NavItem>
          <NavItem onClick ={()=>navigate('/event')}>이벤트</NavItem>
          <NavItem onClick ={()=>navigate('/popup')}>이번주 팝업 스테이션</NavItem>
          <NavItem onClick ={()=>navigate('/bucketlist')}>즐겨찾기/버킷리스트</NavItem>
        </Nav>
      </Left>
      <Right>
        <ToggleSwitch isOn={isEnglish} handleToggle={handleToggle} />
        {/* ===== 로그인/로그아웃 버튼 조건부 렌더링 ===== */}
        {isLoggedIn ? (
          // 로그인된 상태: 사용자 정보 + 로그아웃 버튼 표시
          <UserSection>
            <UserInfo>
              {userData?.email || '사용자'}
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
// ===== 새로 추가된 스타일 컴포넌트들 끝 =====

export default Header;
