import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MerchantMypage from './merchant/MerchantMypage';
import UserMypage from './user/UserMypage';
import styled from 'styled-components';

function MyPage() {
  const navigate = useNavigate();
  const { isMerchant, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingText>로딩 중...</LoadingText>
      </LoadingContainer>
    );
  }

  // 로그인하지 않은 경우
  if (!isAuthenticated) {
    return (
      <UnauthorizedContainer>
        <UnauthorizedText>로그인이 필요합니다.</UnauthorizedText>
        <LoginButton onClick={() => navigate('/login')}>
          로그인하러 가기
        </LoginButton>
      </UnauthorizedContainer>
    );
  }

  // 소상공인인 경우 소상공인 마이페이지, 일반 유저인 경우 일반 마이페이지
  return isMerchant ? <MerchantMypage /> : <UserMypage />;
}

// 스타일 컴포넌트들
const LoadingContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f9fa;
`;

const LoadingText = styled.div`
  font-size: 1.8rem;
  color: #666;
`;

const UnauthorizedContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f8f9fa;
  gap: 2rem;
`;

const UnauthorizedText = styled.h2`
  font-size: 2.4rem;
  color: #666;
  margin: 0;
`;

const LoginButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 10px;
  padding: 1.5rem 3rem;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffe95a;
    transform: translateY(-2px);
  }
`;

export default MyPage;