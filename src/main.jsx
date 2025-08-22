import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const KAKAO_SCRIPT_ID = 'kakao-maps-sdk';

function loadKakaoMaps() {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
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
      resolve(); // allow app to render; map components should guard against missing SDK
      return;
    }

    const script = document.createElement('script');
    script.id = KAKAO_SCRIPT_ID;
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Kakao Maps script'));
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
