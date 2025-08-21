import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: #dc3545;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  color: #dc3545;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isApiError: false,
      errorCode: null
    };
  }

  static getDerivedStateFromError(error) {
    // 에러가 발생했을 때 상태를 업데이트
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 로깅
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // API 에러인지 확인
    const isApiError = error.message && (
      error.message.includes('로그인이 필요합니다') ||
      error.message.includes('접근 권한이 없습니다') ||
      error.message.includes('잘못된 요청입니다') ||
      error.message.includes('요청한 리소스를 찾을 수 없습니다') ||
      error.message.includes('이미 존재하는 데이터입니다') ||
      error.message.includes('입력 데이터가 유효하지 않습니다') ||
      error.message.includes('서버 내부 오류가 발생했습니다')
    );

    // 에러 코드 추출 (API 에러의 경우)
    let errorCode = null;
    if (isApiError) {
      if (error.message.includes('로그인이 필요합니다')) errorCode = 401;
      else if (error.message.includes('접근 권한이 없습니다')) errorCode = 403;
      else if (error.message.includes('잘못된 요청입니다')) errorCode = 400;
      else if (error.message.includes('요청한 리소스를 찾을 수 없습니다')) errorCode = 404;
      else if (error.message.includes('이미 존재하는 데이터입니다')) errorCode = 409;
      else if (error.message.includes('입력 데이터가 유효하지 않습니다')) errorCode = 422;
      else if (error.message.includes('서버 내부 오류가 발생했습니다')) errorCode = 500;
    }

    this.setState({
      error,
      errorInfo,
      isApiError,
      errorCode
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isApiError: false,
      errorCode: null
    });
  }

  render() {
    if (this.state.hasError) {
      const { isApiError, errorCode, error } = this.state;
      
      let errorTitle = '오류가 발생했습니다';
      let errorMessage = '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.';

      if (isApiError) {
        switch (errorCode) {
          case 401:
            errorTitle = '로그인이 필요합니다';
            errorMessage = '이 기능을 사용하려면 로그인이 필요합니다.';
            break;
          case 403:
            errorTitle = '접근 권한이 없습니다';
            errorMessage = '이 기능에 접근할 권한이 없습니다.';
            break;
          case 400:
            errorTitle = '잘못된 요청입니다';
            errorMessage = '입력한 데이터를 확인해주세요.';
            break;
          case 404:
            errorTitle = '요청한 리소스를 찾을 수 없습니다';
            errorMessage = '요청한 페이지나 데이터가 존재하지 않습니다.';
            break;
          case 409:
            errorTitle = '이미 존재하는 데이터입니다';
            errorMessage = '중복된 데이터입니다. 다른 정보를 입력해주세요.';
            break;
          case 422:
            errorTitle = '입력 데이터가 유효하지 않습니다';
            errorMessage = '입력한 데이터 형식을 확인해주세요.';
            break;
          case 500:
            errorTitle = '서버 오류가 발생했습니다';
            errorMessage = '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            errorTitle = 'API 오류가 발생했습니다';
            errorMessage = error?.message || '서버와의 통신 중 오류가 발생했습니다.';
        }
      }

      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>{errorTitle}</ErrorTitle>
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            다시 시도
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
