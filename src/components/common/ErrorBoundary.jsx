import React from 'react';
import styled from 'styled-components';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // 에러가 발생하면 hasError를 true로 설정
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // removeChild 에러는 무시하고 다른 에러만 로깅
    if (!error.message.includes('removeChild')) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // removeChild 에러인 경우 조용히 복구 시도
      if (this.state.error && this.state.error.message.includes('removeChild')) {
        // 잠시 후 자동으로 복구 시도
        setTimeout(() => {
          this.setState({ hasError: false, error: null });
        }, 100);
        
        // 복구 중에는 로딩 상태 표시
        return (
          <ErrorContainer>
            <ErrorContent>
              <LoadingText>페이지를 복구하고 있습니다...</LoadingText>
            </ErrorContent>
          </ErrorContainer>
        );
      }

      // 다른 에러인 경우 사용자에게 표시
      return (
        <ErrorContainer>
          <ErrorContent>
            <ErrorTitle>오류가 발생했습니다</ErrorTitle>
            <ErrorMessage>
              페이지를 새로고침하거나 다시 시도해주세요.
            </ErrorMessage>
            <RetryButton onClick={this.handleRetry}>
              다시 시도
            </RetryButton>
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const ErrorContent = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
`;

const ErrorTitle = styled.h2`
  color: #dc3545;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #666;
  font-size: 1.4rem;
  margin-bottom: 2rem;
`;

const RetryButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 1.4rem;
`;

export default ErrorBoundary;
