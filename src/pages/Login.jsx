import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
// import ApiService from '../utils/apiService'; // 백엔드 배포 시 사용

function Login() {
  const navigate = useNavigate()
  const { login, loginAsUser, loginAsMerchant } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // ===== 더미데이터 로그인 테스트용 (백엔드 배포 후 삭제) =====
  const dummyUsers = [
    { email: 'test@test.com', password: '123456', userType: 'USER', name: '일반 사용자' },
    { email: 'admin@test.com', password: 'admin123', userType: 'USER', name: '관리자' },
    { email: 'merchant@test.com', password: 'merchant123', userType: 'MERCHANT', name: '소상공인' }
  ]

  // 로그인 성공 후 페이지 이동 로직
  const handleLoginSuccess = (userData) => {
    // AuthContext의 login 함수 사용
    const userType = userData.userType === 'MERCHANT' ? 'merchant' : 'user';
    login(userData, userType);

    // 최초 로그인 여부 확인
    const hasLoggedInBefore = localStorage.getItem('hasLoggedInBefore')
    // 카테고리 선택 여부 확인
    const hasSelectedCategories = localStorage.getItem('hasSelectedCategories')

    if (!hasLoggedInBefore) {
      // 최초 로그인: Category1.jsx로 이동
      localStorage.setItem('hasLoggedInBefore', 'true') // 플래그 설정
      console.log('최초 로그인: Category1.jsx로 이동')
      navigate('/category1')
    } else if (!hasSelectedCategories) {
      // 최초 로그인은 아니지만 카테고리를 선택하지 않은 경우: Category1.jsx로 이동
      console.log('카테고리 미선택: Category1.jsx로 이동')
      navigate('/category1')
    } else {
      // 이후 로그인이고 카테고리도 선택한 경우: Category2.jsx로 이동
      console.log('이후 로그인: Category2.jsx로 이동')
      navigate('/category2')
    }
  }

  const handleDummyLogin = () => {
    const user = dummyUsers.find(u => u.email === email && u.password === password)
    if (user) {
      alert(`더미 로그인 성공!\n이메일: ${user.email}\n역할: ${user.userType}`)
      handleLoginSuccess(user) // 로그인 성공 처리 함수 호출
    } else {
      setErrorMessage('더미 계정 정보가 올바르지 않습니다.\n\n테스트 계정:\n- test@test.com / 123456 (일반 사용자)\n- admin@test.com / admin123 (일반 사용자)\n- merchant@test.com / merchant123 (소상공인)')
    }
  }
  // ===== 더미데이터 로그인 테스트용 끝 =====

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    
    // 입력값 검증 (API 명세서에 맞춘 에러 메시지)
    if (!email.trim()) {
      setErrorMessage('이메일은 필수 입력값입니다.')
      setIsLoading(false)
      return
    }
    
    if (!password.trim()) {
      setErrorMessage('비밀번호는 필수 입력값입니다.')
      setIsLoading(false)
      return
    }

    // ===== 현재 더미데이터 버전 (실제 사용 중) =====
    // 백엔드 서버가 없을 때 더미 로그인 실행
    setTimeout(() => {
      handleDummyLogin()
      setIsLoading(false)
    }, 1000)
    
    // ===== 백엔드 배포 시 API 버전 (주석처리) =====
    /*
    try {
      // API 명세서에 맞는 요청 구조
      const loginData = {
        email: email.trim(),
        password: password
      };

      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 기반 인증
        body: JSON.stringify(loginData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('로그인 성공:', result.data);
        handleLoginSuccess(result.data); // 로그인 성공 처리 함수 호출
      } else {
        // API 명세서에 맞춘 에러 메시지 처리
        setErrorMessage(result.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('서버 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
    */

    // ===== ApiService 사용 버전 (백엔드 배포 시 사용) =====
    /*
    try {
      const result = await ApiService.login(email, password);
      
      if (result.success) {
        console.log('로그인 성공:', result.data);
        handleLoginSuccess(result.data);
      } else {
        // API 명세서에 맞춘 에러 메시지 처리
        setErrorMessage(result.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('서버 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
    */
  }

  const clearEmail = () => {
    setEmail('')
  }

  const clearPassword = () => {
    setPassword('')
  }

  // 테스트용 함수들
  const handleTestUserLogin = () => {
    const userData = {
      id: 1,
      email: 'user@test.com',
      userType: 'USER',
      name: '일반 사용자'
    };
    
    // AuthContext의 login 함수 사용
    login(userData, 'user');
    
    alert('일반 사용자로 로그인되었습니다!');
    navigate('/');
  }

  const handleTestMerchantLogin = () => {
    const userData = {
      id: 2,
      email: 'merchant@test.com',
      userType: 'MERCHANT',
      name: '소상공인 사용자'
    };
    
    // AuthContext의 login 함수 사용
    login(userData, 'merchant');
    
    alert('소상공인으로 로그인되었습니다!');
    navigate('/');
  }

  return (
    <Container>
      <MainContent>
        <Title>로그인</Title>
        <Subtitle>계정 정보를 입력하세요</Subtitle>
        
        {/* 테스트용 버튼들 */}
        <TestSection>
          <TestTitle>🧪 테스트용 로그인</TestTitle>
          <TestButtons>
            <TestButton onClick={handleTestUserLogin}>
              일반 사용자로 로그인
            </TestButton>
            <TestButton onClick={handleTestMerchantLogin} merchant>
              소상공인으로 로그인
            </TestButton>
          </TestButtons>
        </TestSection>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputWrapper>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
              />
              {email && (
                <ClearButton onClick={clearEmail}>+</ClearButton>
              )}
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <InputWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
              <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                👁️
              </PasswordToggle>
              {password && (
                <ClearButton onClick={clearPassword}>+</ClearButton>
              )}
            </InputWrapper>
          </InputGroup>

          <ForgotPassword>
            계정이 기억나지 않나요? <SignupLink onClick={() => navigate('/signup')}>가입하기</SignupLink>
          </ForgotPassword>

                     {errorMessage && (
             <ErrorMessage>{errorMessage}</ErrorMessage>
           )}

                      <LoginButton type="submit" disabled={isLoading}>
             {isLoading ? '로그인 중...' : '로그인'}
           </LoginButton>
        </Form>
      </MainContent>

      <Footer>
        <FooterLinks>
          <FooterLink>이용약관</FooterLink>
          <FooterLink>개인정보 처리방침</FooterLink>
          <FooterLink>고객센터</FooterLink>
        </FooterLinks>
      </Footer>
    </Container>
  )
}

export default Login

const Container = styled.div`
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem;
  background-color: white;
  border-bottom: 1px solid #E5E5E5;
`





const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  max-width: 100%;
  width: 100%;
  background-color: white;
`

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  color: #262626;
  margin-bottom: 1rem;
  text-align: center;
`

const Subtitle = styled.p`
  font-size: 1.6rem;
  color: #666;
  margin-bottom: 4rem;
  text-align: center;
`

const Form = styled.form`
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const Input = styled.input`
  width: 100%;
  padding: 2rem 1.5rem;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  font-size: 1.6rem;
  transition: border-color 0.3s ease;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #FEE502;
  }

  &::placeholder {
    color: #999;
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 4rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f0f0f0;
  }
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  padding: 0.5rem;
`

const ForgotPassword = styled.div`
  text-align: center;
  font-size: 1.4rem;
  color: #666;
  margin-top: 1rem;
`

const SignupLink = styled.span`
  color: #FEE502;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const ErrorMessage = styled.div`
  color: #FF6B35;
  font-size: 1.4rem;
  text-align: center;
  padding: 1rem;
  background-color: #FFF5F2;
  border-radius: 8px;
  border: 1px solid #FFE4D6;
`

const LoginButton = styled.button`
  width: 100%;
  padding: 2rem;
  background-color: #FEE502;
  color: #262626;
  border: none;
  border-radius: 8px;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #E6CF00;
  }

  &:disabled {
    background-color: #CCC;
    cursor: not-allowed;
  }
`

const Footer = styled.footer`
  padding: 2rem 3rem;
  background-color: white;
  border-top: 1px solid #E5E5E5;
`

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`

const FooterLink = styled.span`
  font-size: 1.4rem;
  color: #666;
  cursor: pointer;

  &:hover {
    color: #262626;
    text-decoration: underline;
  }
`

// 테스트용 스타일들
const TestSection = styled.div`
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`

const TestTitle = styled.h3`
  font-size: 1.6rem;
  color: #666;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
`

const TestButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`

const TestButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.merchant ? '#10B981' : '#3B82F6'};
  color: white;

  &:hover {
    background: ${props => props.merchant ? '#059669' : '#2563EB'};
    transform: translateY(-2px);
  }
`