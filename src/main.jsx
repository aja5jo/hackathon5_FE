import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

console.log('🚀 main.jsx 파일이 로드되었습니다!');

const KAKAO_SCRIPT_ID = 'kakao-maps-sdk';

function loadKakaoMaps() {
  console.log('loadKakaoMaps 함수 시작');
  return new Promise((resolve, reject) => {
    // Already loaded
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      console.log('카카오 지도가 이미 로드되어 있음');
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
    console.log('환경 변수 로드 시작');
    console.log('import.meta.env:', import.meta.env);
    const key = import.meta.env.VITE_KAKAO_MAP_KEY;
    console.log('ENV KEY:', key);
    console.log('ENV KEY length:', key?.length);
    console.log('ENV KEY type:', typeof key);
    if (!key) {
      console.error('❌ Missing VITE_KAKAO_MAP_KEY in .env');
      console.error('❌ 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
      resolve(); // allow app to render; map components should guard against missing SDK
      return;
    }

    const script = document.createElement('script');
    script.id = KAKAO_SCRIPT_ID;
    script.type = 'text/javascript';
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
    console.log('카카오 지도 스크립트 URL:', script.src);
    script.onload = () => {
      console.log('✅ 카카오 지도 스크립트 로드 성공');
      resolve();
    };
    script.onerror = () => {
      console.error('❌ 카카오 지도 스크립트 로드 실패');
      reject(new Error('Failed to load Kakao Maps script'));
    };
    document.head.appendChild(script);
    console.log('카카오 지도 스크립트 태그 추가됨');
  });
}


console.log('📞 loadKakaoMaps() 함수를 호출합니다...');

loadKakaoMaps()
  .catch((e) => {
    console.error('❌ loadKakaoMaps 에러:', e);
  })
  .finally(() => {
    console.log('🎬 React 앱을 렌더링합니다...');
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
