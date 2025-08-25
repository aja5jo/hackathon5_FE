import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// 카카오맵 API 로딩은 KakaoMap 컴포넌트에서 처리하므로 여기서는 제거
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
