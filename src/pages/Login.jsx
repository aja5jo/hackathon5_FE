import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberPassword, setRememberPassword] = useState(false)
  const [userType, setUserType] = useState(null) // 'user' 또는 'merchant'

  // ===== 더미데이터 로그인 테스트용 (백엔드 배포 후 삭제) =====
  const dummyUsers = [
    { email: 'test@test.com', password: '123456', role: 'user' },
    { email: 'admin@test.com', password: 'admin123', role: 'admin' },
    { email: 'merchant@test.com', password: 'merchant123', role: 'merchant' }
  ]

  // 로그인 성공 후 페이지 이동 로직
  const handleLoginSuccess = (userData) => {
    // 사용자 정보를 세션 스토리지에 저장 (필요시)
    sessionStorage.setItem('user', JSON.stringify(userData))

    // 최초 로그인 여부 확인
    const hasLoggedInBefore = localStorage.getItem('hasLoggedInBefore')
    // 카테고리 선택 여부 확인
    const hasSelectedCategories = localStorage.getItem('hasSelectedCategories')

    // 헤더의 로그인 상태 업데이트를 위한 이벤트 발생
    window.dispatchEvent(new Event('loginStatusChanged'))

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
      alert(`더미 로그인 성공!\n이메일: ${user.email}\n역할: ${user.role}\n사용자타입: ${userType}`)
      handleLoginSuccess(user) // 로그인 성공 처리 함수 호출
    } else {
      setErrorMessage('더미 계정 정보가 올바르지 않습니다.\n\n테스트 계정:\n- test@test.com / 123456\n- admin@test.com / admin123\n- merchant@test.com / merchant123')
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

    // ===== 더미데이터 로그인 테스트용 (백엔드 배포 후 삭제) =====
    // 백엔드 서버가 없을 때 더미 로그인 실행
    setTimeout(() => {
      handleDummyLogin()
      setIsLoading(false)
    }, 1000)
    return
    // ===== 더미데이터 로그인 테스트용 끝 =====

    // ===== 실제 API 호출 (백엔드 배포 후 주석 해제) =====
    /*
    try {
      const response = await fetch('http://localhost:8080/api/login', { // API 명세서에 맞게 엔드포인트 수정
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 기반 인증
        body: JSON.stringify({
          email: email.trim(),
          password: password
          // userType은 백엔드에서 세션에 저장된 정보로 처리
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('로그인 성공:', result.data)
        handleLoginSuccess(result.data) // 로그인 성공 처리 함수 호출
      } else {
        // API 명세서에 맞춘 에러 메시지 처리
        setErrorMessage(result.message || '로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error('Login failed:', error)
      setErrorMessage('서버 연결에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
    */
    // ===== 실제 API 호출 끝 =====
  }

  const handleGoogleLogin = () => {
    alert('구글 로그인 기능은 아직 구현되지 않았습니다.')
  }

  const clearEmail = () => {
    setEmail('')
  }

  const handleUserTypeSelect = (type) => {
    setUserType(type)
  }

  const handleBackToSelection = () => {
    setUserType(null)
    setEmail('')
    setPassword('')
    setErrorMessage('')
  }

  // 사용자 타입 선택 화면
  if (!userType) {
    return (
      <Container>
        <MainContent>
          <SelectionSection>
            <Title>아자오조 회원가입</Title>
            <Subtitle>아자오조 방문이 처음이신가요?</Subtitle>
            
            <ButtonGroup>
              <UserButton onClick={() => handleUserTypeSelect('user')}>
                유저로 계속하기
              </UserButton>
              <MerchantButton onClick={() => handleUserTypeSelect('merchant')}>
                소상공인으로 계속하기
              </MerchantButton>
            </ButtonGroup>
          </SelectionSection>

          <ImageSection>
            <ImagePlaceholder>
              로고나 사진 같은게 들어가면 좋을것 같아요......
            </ImagePlaceholder>
          </ImageSection>
        </MainContent>
      </Container>
    )
  }

  // 로그인 폼 화면
  return (
    <Container>
      <MainContent>
        <LoginSection>
          <BackButton onClick={handleBackToSelection}>
            ← 뒤로가기
          </BackButton>
          
          <Title>아자오조 로그인 페이지</Title>
          <Subtitle>계정 정보를 입력하세요</Subtitle>
          <UserTypeIndicator>
            {userType === 'user' ? '일반 유저' : '소상공인'} 모드
          </UserTypeIndicator>
          
          {errorMessage && (
            <ErrorMessage>
              {errorMessage}
            </ErrorMessage>
          )}
          
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <InputWrapper>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejajjo@ejajjo.com"
                  required
                />
                {email && (
                  <ClearButton onClick={clearEmail}>✕</ClearButton>
                )}
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputWrapper>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  required
                />
                <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </PasswordToggle>
              </InputWrapper>
            </InputGroup>

            <OptionsRow>
              <CheckboxWrapper>
                <Checkbox
                  type="checkbox"
                  checked={rememberPassword}
                  onChange={(e) => setRememberPassword(e.target.checked)}
                />
                <CheckboxLabel>비밀번호 기억하기</CheckboxLabel>
              </CheckboxWrapper>
              <ForgotPassword href="#">비밀번호를 잊으셨나요?</ForgotPassword>
            </OptionsRow>

            <LoginButton type="submit" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인하기'}
            </LoginButton>

            <GoogleButton type="button" onClick={handleGoogleLogin}>
              <GoogleIcon>G</GoogleIcon>
              구글로 로그인하기
            </GoogleButton>

            <SignupLink>
              계정이 없으신가요? <SignupText onClick={() => navigate('/signup')}>회원가입</SignupText>
            </SignupLink>
          </Form>
        </LoginSection>

        <ImageSection>
          <ImagePlaceholder>
            로고나 사진 같은게 들어가면 좋을것 같아요......
          </ImagePlaceholder>
        </ImageSection>
      </MainContent>
    </Container>
  )
}

export default Login

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`

const MainContent = styled.div`
  display: flex;
  min-height: 100vh;
`

const SelectionSection = styled.div`
  flex: 1;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
`

const LoginSection = styled.div`
  flex: 1;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
`

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  color: #262626;
  margin-bottom: 1rem;
`

const Subtitle = styled.p`
  font-size: 1.6rem;
  color: #666;
  margin-bottom: 3rem;
`

const UserTypeIndicator = styled.div`
  background-color: #FF6B35;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
  font-size: 1.4rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  display: inline-block;
  align-self: flex-start;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const UserButton = styled.button`
  background-color: #FF6B35;
  color: white;
  border: none;
  padding: 2rem;
  border-radius: 8px;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #E55A2B;
    transform: translateY(-2px);
  }
`

const MerchantButton = styled.button`
  background-color: white;
  color: #262626;
  border: 1px solid #E5E5E5;
  padding: 2rem;
  border-radius: 8px;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
    border-color: #CCCCCC;
    transform: translateY(-2px);
  }
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  align-self: flex-start;
  
  &:hover {
    color: #FF6B35;
  }
`

const Form = styled.form`
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
  padding: 1.5rem;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 1.6rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
  }

  &::placeholder {
    color: #999999;
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  
  &:hover {
    background-color: #f0f0f0;
  }
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.5rem;
`

const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`

const Checkbox = styled.input`
  width: 1.6rem;
  height: 1.6rem;
`

const CheckboxLabel = styled.label`
  font-size: 1.4rem;
  color: #666;
`

const ForgotPassword = styled.a`
  font-size: 1.4rem;
  color: #666;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    color: #FF6B35;
  }
`

const LoginButton = styled.button`
  background-color: #FF6B35;
  color: white;
  border: none;
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #E55A2B;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #CCCCCC;
    cursor: not-allowed;
    transform: none;
  }
`

const GoogleButton = styled.button`
  background-color: white;
  color: #262626;
  border: 1px solid #E5E5E5;
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &:hover {
    background-color: #f8f9fa;
    border-color: #CCCCCC;
  }
`

const GoogleIcon = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
  color: #4285F4;
`

const SignupLink = styled.div`
  text-align: center;
  font-size: 1.4rem;
  color: #666;
  margin-top: 2rem;
`

const SignupText = styled.span`
  color: #FF6B35;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
`

const ImagePlaceholder = styled.div`
  background-color: #E8E4F3;
  border-radius: 12px;
  padding: 4rem;
  text-align: center;
  color: #666;
  font-size: 1.4rem;
  width: 100%;
  max-width: 400px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.4rem;
  text-align: center;
  border: 1px solid #ffcdd2;
  margin-bottom: 2rem;
`