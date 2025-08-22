import { RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import "./styles/font.css";
import { GlobalStyles } from './styles/GlobalStyles'
import { AuthProvider } from './contexts/AuthContext'
import router from './Router'
import Translator from './utils/translate-sdk'
import ErrorBoundary from './components/common/ErrorBoundary'
function App() {
  useEffect(() => {
    // ===== 번역 SDK 초기화 =====
    const t = new Translator({ viewerSelector: '#viewer' });
    
    t.init().then(async () => {
      // 저장된 언어 설정 불러오기
      const saved = localStorage.getItem('translator:selected') || 'KOREAN';
      try {
        await t.setTarget(saved);
      } catch (e) {
        console.warn('Failed to restore saved language:', e);
      }
    }).catch(e => {
      console.warn('Translator SDK initialization failed:', e);
    });

    // ===== 언어 변경 이벤트 리스너 =====
    const onLang = (e) => {
      t.setTarget(e.detail).catch(e => {
        console.error('Language change failed:', e);
      });
    };

    window.addEventListener('translator:languageChanged', onLang);

    // ===== 정리 함수 =====
    return () => {
      window.removeEventListener('translator:languageChanged', onLang);
      t.abortOngoing();
    };
  }, []);

  return (
    <>
      <GlobalStyles/>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </>
  )
}

export default App
