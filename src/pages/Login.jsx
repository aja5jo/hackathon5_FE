import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    
    // 입력값 검증
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
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 쿠키 포함
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('로그인 성공:', result.data)
        // 로그인 성공 시 홈으로 리다이렉트
        navigate('/')
      } else {
        // API에서 반환된 에러 메시지 표시
        setErrorMessage(result.message || '로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error('Login failed:', error)
      setErrorMessage('서버 연결에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <LoginBox>
        <Logo>
          <LogoText>꼬꼬리스트</LogoText>
        </Logo>
        
        <Form onSubmit={handleSubmit}>
          <Title>로그인</Title>
          
          {errorMessage && (
            <ErrorMessage>
              {errorMessage}
            </ErrorMessage>
          )}
          
          <InputGroup>
            <Label>이메일</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              required
            />
          </InputGroup>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </LoginButton>

          <LinkGroup>
            <Link href="#">비밀번호를 잊으셨나요?</Link>
            <Divider>|</Divider>
            <Link href="#" onClick={() => navigate('/signup')}>회원가입</Link>
          </LinkGroup>
        </Form>
      </LoginBox>
    </Container>
  )
}

export default Login

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 2rem;
`

const LoginBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 4rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`

const Logo = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`

const LogoText = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  color: #FEE502;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const Title = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: #262626;
  text-align: center;
  margin-bottom: 1rem;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const Label = styled.label`
  font-size: 1.4rem;
  font-weight: 500;
  color: #262626;
`

const Input = styled.input`
  padding: 1.2rem;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 1.6rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #FEE502;
    box-shadow: 0 0 0 2px rgba(254, 229, 2, 0.1);
  }

  &::placeholder {
    color: #999999;
  }
`

const LoginButton = styled.button`
  background-color: #FEE502;
  color: #262626;
  border: none;
  padding: 1.4rem;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #E5CC00;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #CCCCCC;
    cursor: not-allowed;
    transform: none;
  }
`

const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`

const Link = styled.a`
  font-size: 1.4rem;
  color: #666666;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #FEE502;
  }
`

const Divider = styled.span`
  color: #CCCCCC;
  font-size: 1.2rem;
`

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.4rem;
  text-align: center;
  border: 1px solid #ffcdd2;
  margin-bottom: 1rem;
`