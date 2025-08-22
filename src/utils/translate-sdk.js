// ===== Google Translate SDK =====
// 백엔드 API를 통해 Google Cloud Translation API를 호출하는 SDK

class Translator {
  constructor(options = {}) {
    this.viewerSelector = options.viewerSelector || '#viewer';
    this.originalHtml = null;
    this.currentTarget = 'KOREAN';
    this.isInitialized = false;
    this.abortController = null;
    this.apiBaseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-domain.com/api' 
      : 'http://localhost:8080/api';
  }

  // SDK 초기화
  async init() {
    try {
      const viewer = document.querySelector(this.viewerSelector);
      if (!viewer) {
        throw new Error(`Viewer element not found: ${this.viewerSelector}`);
      }

      // 원문 HTML 저장
      this.originalHtml = viewer.innerHTML;
      this.isInitialized = true;
      
  
      return true;
    } catch (error) {
      console.error('Translator SDK initialization failed:', error);
      throw error;
    }
  }

  // 대상 언어 설정 및 번역 실행
  async setTarget(targetLanguage) {
    if (!this.isInitialized) {
      throw new Error('Translator SDK not initialized. Call init() first.');
    }

    // 이전 요청 취소
    if (this.abortController) {
      this.abortController.abort();
    }

    this.currentTarget = targetLanguage;
    const viewer = document.querySelector(this.viewerSelector);

    // KOREAN인 경우 원문 복원
    if (targetLanguage === 'KOREAN') {
      viewer.innerHTML = this.originalHtml;
      
      return;
    }

    try {
      // 새로운 AbortController 생성
      this.abortController = new AbortController();

      // 백엔드 API 호출
      const response = await fetch(`${this.apiBaseUrl}/translate/html/raw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal: this.abortController.signal,
        body: JSON.stringify({
          html: this.originalHtml,
          target: targetLanguage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const translatedHtml = await response.text();
      viewer.innerHTML = translatedHtml;
      
      console.log(`Content translated to ${targetLanguage}`);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Translation request was cancelled');
        return;
      }
      console.error('Translation failed:', error);
      throw error;
    }
  }

  // 진행 중인 번역 요청 취소
  abortOngoing() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // 현재 언어 반환
  getCurrentTarget() {
    return this.currentTarget;
  }

  // 원문 HTML 반환
  getOriginalHtml() {
    return this.originalHtml;
  }

  // 초기화 상태 확인
  isReady() {
    return this.isInitialized;
  }

  // 지원 언어 목록
  static getSupportedLanguages() {
    return [
      { code: 'KOREAN', name: '한국어', flag: '🇰🇷' },
      { code: 'ENGLISH', name: 'English', flag: '🇺🇸' },
      { code: 'JAPANESE', name: '日本語', flag: '🇯🇵' },
      { code: 'CHINESE', name: '中文', flag: '🇨🇳' },
      { code: 'FRENCH', name: 'Français', flag: '🇫🇷' },
      { code: 'ARABIC', name: 'العربية', flag: '🇸🇦' },
      { code: 'VIETNAMESE', name: 'Tiếng Việt', flag: '🇻🇳' },
      { code: 'THAI', name: 'ไทย', flag: '🇹🇭' },
      { code: 'ITALIAN', name: 'Italiano', flag: '🇮🇹' },
      { code: 'SPANISH', name: 'Español', flag: '🇪🇸' },
      { code: 'GERMAN', name: 'Deutsch', flag: '🇩🇪' }
    ];
  }
}

export default Translator;
