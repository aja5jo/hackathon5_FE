import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ToggleSwitch from './ToggleSwitch';

const Header = () => {
  const navigate = useNavigate();
  const [isEnglish, setIsEnglish] = useState(false);
  const handleToggle = () => setIsEnglish(prev => !prev);

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
       <LoginButton onClick ={()=>navigate('/login')}>로그인</LoginButton>
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
`;


export default Header;
