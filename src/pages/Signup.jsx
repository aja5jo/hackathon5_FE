import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
// import ApiService from '../utils/apiService'; // 백엔드 배포 시 사용

function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('') // 'USER' 또는 'MERCHANT'
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ===== 더미데이터 회원가입 테스트용 (백엔드 배포 후 삭제) =====
  const handleDummySignup = () => {
    // 비밀번호 확인 검증
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.')
      return
    }

    // 비밀번호 길이 검증 (6-20자)
    if (password.length < 6 || password.length > 20) {
      setErrorMessage('비밀번호는 6자 이상 20자 이하로 입력해주세요.')
      return
    }

    // 이메일 중복 체크 (더미)
    const existingEmails = ['test@test.com', 'admin@test.com', 'merchant@test.com']
    if (existingEmails.includes(email)) {
      setErrorMessage(`이미 사용 중인 이메일입니다: ${email}`)
      return
    }

    // 성공 시뮬레이션
    alert(`더미 회원가입 성공!\n이메일: ${email}\n역할: ${role}`)
    navigate('/login')
  }
  // ===== 더미데이터 회원가입 테스트용 끝 =====

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

    if (!role) {
      setErrorMessage('역할(role)은 필수입니다.')
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

    // ===== 현재 더미데이터 버전 (실제 사용 중) =====
    setTimeout(() => {
      handleDummySignup()
      setIsLoading(false)
    }, 1000)
    
    // ===== 백엔드 배포 시 API 버전 (주석처리) =====
    /*
    try {
      // API 명세서에 맞는 요청 구조
      const signupData = {
        email: email.trim(),
        password: password,
        role: role
      };

      const response = await fetch('http://localhost:8080/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(signupData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('회원가입 성공:', result.data);
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
      } else {
        // API 명세서에 따른 에러 메시지 처리
        setErrorMessage(result.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setErrorMessage('서버 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
    */

    // ===== ApiService 사용 버전 (백엔드 배포 시 사용) =====
    /*
    try {
      const result = await ApiService.signup(email, password, role);
      
      if (result.success) {
        console.log('회원가입 성공:', result.data);
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
      } else {
        // API 명세서에 따른 에러 메시지 처리
        setErrorMessage(result.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
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
              <RoleButton
                type="button"
                selected={role === 'USER'}
                onClick={() => setRole('USER')}
              >
                유저
              </RoleButton>
              <RoleButton
                type="button"
                selected={role === 'MERCHANT'}
                onClick={() => setRole('MERCHANT')}
              >
                소상공인
              </RoleButton>
            </RoleButtons>
            <RoleHint>로그인 유형을 선택하세요.</RoleHint>
          </RoleSection>

          {errorMessage && (
            <ErrorMessage>{errorMessage}</ErrorMessage>
          )}

          <SignupButton type="submit" disabled={isLoading}>
            {isLoading ? '회원가입 중...' : '회원가입'}
          </SignupButton>
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
`

const RoleButton = styled.button`
  flex: 1;
  padding: 2rem;
  border: 2px solid ${props => props.selected ? '#FEE502' : '#E5E5E5'};
  border-radius: 8px;
  background-color: ${props => props.selected ? '#FEE502' : 'white'};
  color: #262626;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #FEE502;
    background-color: ${props => props.selected ? '#FEE502' : '#FFF9CC'};
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
