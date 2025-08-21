import React from 'react';

const TestPage = () => {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1>테스트 페이지</h1>
      <p>이 페이지가 보인다면 React 앱이 정상적으로 작동하고 있습니다.</p>
      <div style={{ 
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px'
      }}>
        <p>현재 시간: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TestPage;
