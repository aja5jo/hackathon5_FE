import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const KAKAO_SCRIPT_ID = 'kakao-maps-sdk';

function loadKakaoMaps() {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      console.log('카카오맵 API가 이미 로드되어 있습니다.');
      resolve();
      return;
    }

    // If a script tag already exists, attach listeners
    const existing = document.getElementById(KAKAO_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Kakao Maps script')), { once: true });
      return;
    }

    // Create a new script tag with the env key
    const key = import.meta.env.VITE_KAKAO_MAP_KEY;
    if (!key) {
      console.warn('VITE_KAKAO_MAP_KEY가 설정되지 않았습니다. 카카오맵이 표시되지 않을 수 있습니다.');
      resolve(); // allow app to render; map components should guard against missing SDK
      return;
    }

    console.log('카카오맵 API 로드 시작...');
    console.log('API 키:', key.substring(0, 8) + '...'); // 보안을 위해 일부만 출력
    
    const script = document.createElement('script');
    script.id = KAKAO_SCRIPT_ID;
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services,clusterer`;
    
    script.onload = () => {
      console.log('카카오맵 API 스크립트 로드 완료');
      // API가 완전히 로드될 때까지 잠시 대기
      setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          console.log('카카오맵 API 초기화 완료');
          resolve();
        } else {
          console.error('카카오맵 API 초기화 실패');
          reject(new Error('Kakao Maps API initialization failed'));
        }
      }, 2000); // 2초 대기
    };
    
    script.onerror = () => {
      console.error('카카오맵 API 스크립트 로드 실패');
      reject(new Error('Failed to load Kakao Maps script'));
    };
    
    document.head.appendChild(script);
  });
}

loadKakaoMaps()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
