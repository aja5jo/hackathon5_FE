import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../services/api'


function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // 로그인 성공 후 페이지 이동 로직
  const handleLoginSuccess = async (userData) => {
    console.log('handleLoginSuccess 호출됨:', userData);
    
    // AuthContext의 login 함수 사용
    const userType = userData.role === 'MERCHANT' ? 'merchant' : 'user';
    console.log('userType 결정됨:', userType);
    login(userData, userType);
    
    // localStorage 저장이 완료될 때까지 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 로그인 후 세션 상태 확인
    console.log('로그인 후 세션 상태 확인:');
    console.log('- localStorage user:', localStorage.getItem('user'));
    console.log('- localStorage userType:', localStorage.getItem('userType'));
    console.log('- 쿠키 확인:', document.cookie);

    // 소상공인인 경우 기존 가게 확인 후 페이지 이동
    if (userType === 'merchant') {
      console.log('소상공인 로그인: 기존 가게 확인 중...');
      
             try {
         // 기존 가게 확인 API 호출
         const { storesAPI } = await import('../services/api');
         console.log('storesAPI.getMyStores() 호출 시작...');
         const response = await storesAPI.getMyStores();
         console.log('API 응답 전체:', response);
         console.log('response.success:', response.success);
         console.log('response.data:', response.data);
         console.log('response.data.length:', response.data?.length);
         
         // API 응답 구조 확인: data가 배열인지 단일 객체인지 확인
         const hasStore = response.success && response.data && (
           Array.isArray(response.data) ? response.data.length > 0 : 
           typeof response.data === 'object' && response.data.id
         );
         
         console.log('가게 존재 여부 판단:', {
           success: response.success,
           hasData: !!response.data,
           isArray: Array.isArray(response.data),
           isObject: typeof response.data === 'object',
           hasId: response.data?.id,
           dataType: typeof response.data
         });
         
         if (hasStore) {
           // 이미 가게가 등록된 경우: 홈으로 이동
           console.log('기존 가게 발견: 홈으로 이동');
           navigate('/');
         } else {
           // 가게가 등록되지 않은 경우: 가게등록 페이지로 이동
           console.log('가게 미등록: 가게등록 페이지로 이동');
           console.log('이유:', {
             success: response.success,
             hasData: !!response.data,
             isArray: Array.isArray(response.data),
             isObject: typeof response.data === 'object',
             hasId: response.data?.id
           });
           navigate('/merchants/stores');
         }
       } catch (error) {
         console.error('기존 가게 확인 실패:', error);
         console.error('에러 상세:', {
           message: error.message,
           status: error.status,
           response: error.response
         });
         // 에러 발생 시 가게등록 페이지로 이동
         console.log('에러 발생: 가게등록 페이지로 이동');
         navigate('/merchants/stores');
       }
    } else {
      // 일반 사용자인 경우
      console.log('일반 유저 로그인 처리 시작');
      
      // 사용자별 최초 로그인 여부 확인 (이메일 기반)
      const userEmail = userData.email;
      const userLoginKey = `hasLoggedInBefore_${userEmail}`;
      const hasLoggedInBefore = localStorage.getItem(userLoginKey);
      
      // 카테고리 선택 여부 확인
      const hasSelectedCategories = localStorage.getItem('hasSelectedCategories');
      
      // 디버깅: 기존 잘못된 플래그가 있다면 제거 (개발 중에만 사용)
      const oldFlag = localStorage.getItem('hasLoggedInBefore');
      if (oldFlag && !hasLoggedInBefore) {
        console.log('기존 잘못된 플래그 발견, 제거:', oldFlag);
        localStorage.removeItem('hasLoggedInBefore');
      }
      
      console.log('일반 유저 상태 확인:', {
        userEmail,
        hasLoggedInBefore,
        hasSelectedCategories,
        oldFlag
      });
      
      if (!hasLoggedInBefore) {
        // 최초 로그인: Category1.jsx로 이동
        localStorage.setItem(userLoginKey, 'true'); // 해당 사용자의 최초 로그인 플래그 설정
        console.log('최초 로그인: Category1.jsx로 이동');
        navigate('/category1');
      } else if (!hasSelectedCategories) {
        // 최초 로그인은 아니지만 카테고리를 선택하지 않은 경우: Category1.jsx로 이동
        console.log('카테고리 미선택: Category1.jsx로 이동');
        navigate('/category1');
      } else {
        // 이후 로그인이고 카테고리도 선택한 경우: categories 페이지로 이동
        console.log('이후 로그인: categories 페이지로 이동');
        navigate('/categories');
      }
    }
  }

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

    try {
      // ===== 백엔드 API 버전 (활성화) =====
      // API 명세서에 맞는 요청 구조
      const loginData = {
        email: email.trim(),
        password: password
      };

      const result = await authAPI.login(loginData);
      
      if (result.success) {
        console.log('로그인 성공:', result.data);
        handleLoginSuccess(result.data); // 로그인 성공 처리 함수 호출
      } else {
        // API 명세서에 맞춘 에러 메시지 처리
        setErrorMessage(result.message || '로그인에 실패했습니다.');
      }
      
      // ===== 더미데이터 버전 (주석처리) =====
      /*
      // 백엔드 서버가 없을 때 더미 로그인 실행
      setTimeout(() => {
        handleDummyLogin()
        setIsLoading(false)
      }, 1000)
      */
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('서버 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
    
  }

  const clearEmail = () => {
    setEmail('')
  }

  const clearPassword = () => {
    setPassword('')
  }



  return (
    <Container>
      <MainContent>
        <Title>로그인</Title>
        <Subtitle>계정 정보를 입력하세요</Subtitle>
        

        
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
  width: 100%;
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
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #FEE502;
    color: #262626;
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

