import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const NAVER_SCRIPT_ID = 'naver-maps-sdk';

function loadNaverMaps() {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (typeof window !== 'undefined' && window.naver && window.naver.maps) {
      resolve();
      return;
    }

    // If a script tag already exists, attach listeners
    const existing = document.getElementById(NAVER_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Naver Maps script')), { once: true });
      return;
    }

    // Create a new script tag with the env key
    const key = import.meta.env.VITE_NAVER_MAP_KEY;
    console.log('ENV KEY:', key);
    if (!key) {
      console.error('❌ Missing VITE_NAVER_MAP_KEY in .env');
      resolve(); // allow app to render; map components should guard against missing SDK
      return;
    }

    const script = document.createElement('script');
    script.id = NAVER_SCRIPT_ID;
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${key}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Naver Maps script'));
    document.head.appendChild(script);
  });
}


loadNaverMaps()
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
