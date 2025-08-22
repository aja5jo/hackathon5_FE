import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'


function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('') // '', 'USER' 또는 'MERCHANT'
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)





  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    
    // 입력값 검증 (API 명세서에 맞춘 에러 메시지)
    if (!email.trim()) {
      setErrorMessage('이메일은 필수입니다.')
      setIsLoading(false)
      return
    }
    
    if (!password.trim()) {
      setErrorMessage('비밀번호는 필수입니다.')
      setIsLoading(false)
      return
    }

    if (!role || role === '') {
      setErrorMessage('사용자 유형을 선택해주세요.')
      setIsLoading(false)
      return
    }

    // 비밀번호 확인 검증
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.')
      setIsLoading(false)
      return
    }

    // 비밀번호 길이 검증 (6-20자)
    if (password.length < 6 || password.length > 20) {
      setErrorMessage('비밀번호는 6자 이상 20자 이하로 입력해주세요.')
      setIsLoading(false)
      return
    }

    try {
      // ===== 백엔드 API 버전 (활성화) =====
      // API 명세서에 맞는 요청 구조
      const signupData = {
        email: email.trim(),
        password: password,
        role: role
      };

      const result = await authAPI.register(signupData);
      
      if (result.success) {
        alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        navigate('/login');
      } else {
        // API 명세서에 맞춘 에러 메시지 처리
        
        // 서버 에러(500)인 경우 에러 메시지 표시
        if (result.code === 500 || response.status === 500) {
          throw new Error('서버 내부 오류');
        }
        
        setErrorMessage(result.message || '회원가입에 실패했습니다.');
      }
      
      // ===== 더미데이터 버전 (주석처리) =====
      /*
      setTimeout(() => {
        handleDummySignup()
        setIsLoading(false)
      }, 1000)
      */
      
    } catch (error) {
      if (error.message === '서버 내부 오류') {
        setErrorMessage('서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.message.includes('Failed to fetch')) {
        setErrorMessage('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        setErrorMessage('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
    
  };

  const clearEmail = () => {
    setEmail('')
  }

  const clearPassword = () => {
    setPassword('')
  }

  const clearConfirmPassword = () => {
    setConfirmPassword('')
  }

  return (
    <Container>
      

      <MainContent>
        <Title>회원가입</Title>
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
            <DuplicateCheck>
              <DuplicateText>아이디 중복확인</DuplicateText>
              <DuplicateIcon>●</DuplicateIcon>
            </DuplicateCheck>
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

          <InputGroup>
            <InputWrapper>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
              <PasswordToggle onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                👁️
              </PasswordToggle>
              {confirmPassword && (
                <ClearButton onClick={clearConfirmPassword}>+</ClearButton>
              )}
            </InputWrapper>
          </InputGroup>

          <RoleSection>
            <RoleTitle>사용자 유형</RoleTitle>
            <RoleButtons>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '2rem',
                  border: `2px solid ${role === 'USER' ? '#FEE502' : '#E5E5E5'}`,
                  borderRadius: '8px',
                  backgroundColor: role === 'USER' ? '#FEE502' : 'white',
                  color: '#262626',
                  fontSize: '1.6rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'center',
                  userSelect: 'none',
                  position: 'relative',
                  zIndex: 999,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setRole('USER');
                }}
              >
                유저
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '2rem',
                  border: `2px solid ${role === 'MERCHANT' ? '#FEE502' : '#E5E5E5'}`,
                  borderRadius: '8px',
                  backgroundColor: role === 'MERCHANT' ? '#FEE502' : 'white',
                  color: '#262626',
                  fontSize: '1.6rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'center',
                  userSelect: 'none',
                  position: 'relative',
                  zIndex: 999,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setRole('MERCHANT');
                }}
              >
                소상공인
              </button>
            </RoleButtons>
            <RoleHint style={{ color: !role || role === '' ? '#FF6B35' : '#666' }}>
              {!role || role === '' ? '⚠️ 사용자 유형을 선택해주세요.' : '로그인 유형을 선택하세요.'}
            </RoleHint>
          </RoleSection>

          {errorMessage && (
            <ErrorMessage>{errorMessage}</ErrorMessage>
          )}

          <SignupButton type="submit" disabled={isLoading}>
            {isLoading ? '회원가입 중...' : '회원가입'}
          </SignupButton>
          
          <LoginLink>
            이미 계정이 있으신가요? <LoginLinkText onClick={() => navigate('/login')}>로그인하기</LoginLinkText>
          </LoginLink>
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

export default Signup

const Container = styled.div`
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
`

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
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

const DuplicateCheck = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

const DuplicateText = styled.span`
  font-size: 1.2rem;
  color: #666;
`

const DuplicateIcon = styled.span`
  font-size: 1rem;
  color: #000;
`

const RoleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const RoleTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: #262626;
  margin: 0;
`

const RoleButtons = styled.div`
  display: flex;
  gap: 1rem;
  pointer-events: auto;
  position: relative;
  z-index: 1;
`

const RoleButton = styled.button`
  flex: 1;
  padding: 2rem;
  border: 2px solid ${props => props.$selected ? '#FEE502' : '#E5E5E5'};
  border-radius: 8px;
  background-color: ${props => props.$selected ? '#FEE502' : 'white'};
  color: #262626;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  user-select: none;
  outline: none;
  pointer-events: auto !important;
  position: relative;
  z-index: 999;
  touch-action: manipulation;

  &:hover {
    border-color: #FEE502;
    background-color: ${props => props.$selected ? '#FEE502' : '#FFF9CC'};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: 2px solid #FEE502;
    outline-offset: 2px;
  }
`

const RoleHint = styled.div`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
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

const SignupButton = styled.button`
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

const LoginLink = styled.div`
  text-align: center;
  font-size: 1.4rem;
  color: #666;
  margin-top: 1rem;
`

const LoginLinkText = styled.span`
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
