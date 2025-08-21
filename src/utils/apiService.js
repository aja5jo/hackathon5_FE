// ===== 백엔드 배포 시 사용할 API 서비스 =====

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com/api' 
  : 'http://localhost:8080/api';

class ApiService {
  // 인증 토큰 가져오기
  static getAuthToken() {
    return localStorage.getItem('accessToken');
  }

  // 기본 헤더 설정
  static getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // API 명세서 기반 에러 처리 강화
  static handleApiError(response, errorData) {
    switch (response.status) {
      case 400:
        throw new Error(errorData.message || "잘못된 요청입니다.");
      case 401:
        throw new Error("로그인이 필요합니다.");
      case 403:
        throw new Error("접근 권한이 없습니다.");
      case 404:
        throw new Error("요청한 리소스를 찾을 수 없습니다.");
      case 409:
        throw new Error(errorData.message || "이미 존재하는 데이터입니다.");
      case 422:
        throw new Error(errorData.message || "입력 데이터가 유효하지 않습니다.");
      case 500:
        throw new Error("서버 내부 오류가 발생했습니다.");
      default:
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  // 공통 응답 처리 메서드
  static async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      this.handleApiError(response, errorData);
    }
    return await response.json();
  }

  // 홈 페이지 데이터 업데이트
  static async updateHomeData() {
    try {
      const response = await fetch(`${API_BASE_URL}/home/update`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('홈 데이터 업데이트 실패:', error);
      throw error;
    }
  }

  // 홈 페이지 데이터 가져오기
  static async getHomeData() {
    try {
      const response = await fetch(`${API_BASE_URL}/home`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('홈 데이터 가져오기 실패:', error);
      throw error;
    }
  }

  // 이벤트 데이터 가져오기
  static async getEvents(category = 'all') {
    try {
      const response = await fetch(`${API_BASE_URL}/events?category=${category}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('이벤트 데이터 가져오기 실패:', error);
      throw error;
    }
  }

  // 팝업 데이터 가져오기
  static async getPopups(filter = 'all') {
    try {
      // API 명세서에 따르면 /api/popup 엔드포인트 사용
      const response = await fetch(`${API_BASE_URL}/popup?filter=${filter}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('팝업 데이터 가져오기 실패:', error);
      throw error;
    }
  }

  // 즐겨찾기 추가 (가게)
  static async addStoreToFavorites(storeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/stores/${storeId}/favorites`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('가게 즐겨찾기 추가 실패:', error);
      throw error;
    }
  }

  // 즐겨찾기 추가 (이벤트)
  static async addEventToFavorites(eventId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/events/${eventId}/favorites`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('이벤트 즐겨찾기 추가 실패:', error);
      throw error;
    }
  }

  // 즐겨찾기 추가 (팝업)
  static async addPopupToFavorites(popupId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/popups/${popupId}/favorites`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('팝업 즐겨찾기 추가 실패:', error);
      throw error;
    }
  }

  // 즐겨찾기 제거
  static async removeFromFavorites(itemId, itemType) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites/${itemId}?type=${itemType}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('즐겨찾기 제거 실패:', error);
      throw error;
    }
  }

  // 즐겨찾기 목록 가져오기
  static async getFavorites() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('즐겨찾기 목록 가져오기 실패:', error);
      throw error;
    }
  }

  // 검색
  static async search(query, category = 'all') {
    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&category=${category}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('검색 실패:', error);
      throw error;
    }
  }

  // 회원가입
  static async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  }

  // 로그인
  static async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  }

  // 로그아웃
  static async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  }

  // 카테고리 목록 가져오기
  static async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('카테고리 목록 가져오기 실패:', error);
      throw error;
    }
  }

  // 특정 카테고리 피드 가져오기
  static async getCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${category}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('카테고리 피드 가져오기 실패:', error);
      throw error;
    }
  }

  // ===== 번역 API =====

  // 이미지 번역 (POST /api/translate)
  static async translateImage(imageUrl, targetLang, forceMode = false) {
    try {
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          imageUrl,
          targetLang,
          forceMode
        })
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('이미지 번역 실패:', error);
      throw error;
    }
  }

  // HTML 번역 (POST /api/translate/html/raw)
  static async translateHtml(html, target) {
    try {
      const response = await fetch(`${API_BASE_URL}/translate/html/raw`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          html,
          target
        })
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('HTML 번역 실패:', error);
      throw error;
    }
  }

  // 배치 번역 (POST /api/translate/batch)
  static async translateBatch(texts, targetLang) {
    try {
      const response = await fetch(`${API_BASE_URL}/translate/batch`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          texts,
          targetLang
        })
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('배치 번역 실패:', error);
      throw error;
    }
  }

  // ===== 상인 전용 API =====

  // 상인 이벤트 생성
  static async createMerchantEvent(eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/events`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(eventData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('상인 이벤트 생성 실패:', error);
      throw error;
    }
  }

  // 상인 이벤트 수정
  static async updateMerchantEvent(eventId, eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/events/${eventId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(eventData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('상인 이벤트 수정 실패:', error);
      throw error;
    }
  }

  // 상인 이벤트 부분 수정
  static async patchMerchantEvent(eventId, patchData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/events/${eventId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(patchData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('상인 이벤트 부분 수정 실패:', error);
      throw error;
    }
  }

  // 상인 팝업 생성
  static async createMerchantPopup(popupData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/popups`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(popupData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('상인 팝업 생성 실패:', error);
      throw error;
    }
  }

  // 상인 팝업 수정
  static async updateMerchantPopup(popupId, popupData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/popups/${popupId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(popupData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('상인 팝업 수정 실패:', error);
      throw error;
    }
  }

  // 상인 팝업 부분 수정
  static async patchMerchantPopup(popupId, patchData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/popups/${popupId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(patchData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('상인 팝업 부분 수정 실패:', error);
      throw error;
    }
  }

  // 상인 내 팝업 조회
  static async getMyPopups() {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/popups`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('상인 내 팝업 조회 실패:', error);
      throw error;
    }
  }

  // ===== 상인 가게 관리 API =====

  // 가게 등록
  static async createStore(storeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/stores`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(storeData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('가게 등록 실패:', error);
      throw error;
    }
  }

  // 내 가게 목록 조회
  static async getMyStores() {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/stores`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('내 가게 목록 조회 실패:', error);
      throw error;
    }
  }

  // 가게 전체 수정
  static async updateStore(storeId, storeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/stores/${storeId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(storeData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('가게 전체 수정 실패:', error);
      throw error;
    }
  }

  // 가게 부분 수정
  static async patchStore(storeId, patchData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/stores/${storeId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(patchData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('가게 부분 수정 실패:', error);
      throw error;
    }
  }

  // ===== AI 이벤트/팝업 미리보기 API =====

  // AI 이벤트 미리보기 (POST /api/merchants/stores/events/preview)
  static async previewEventAi(eventData) {
    try {
      // 명세서의 EventAiCreateRequest DTO 구조에 맞게 데이터 구성
      const requestData = {
        name: eventData.name, // 필수
        category: eventData.category, // 선택
        address: eventData.address, // 선택
        introHint: eventData.introHint, // 선택
        imageUrls: eventData.imageUrls || [] // 선택
      };

      const response = await fetch(`${API_BASE_URL}/merchants/stores/events/preview`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(requestData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('AI 이벤트 미리보기 실패:', error);
      throw error;
    }
  }

  // AI 팝업 미리보기 (POST /api/merchants/popups/preview)
  static async previewPopupAi(popupData) {
    try {
      // 명세서의 PopupAiCreateRequest DTO 구조에 맞게 데이터 구성
      const requestData = {
        name: popupData.name, // 필수
        category: popupData.category, // 필수
        address: popupData.address, // 필수
        introHint: popupData.introHint, // 선택
        imageUrls: popupData.imageUrls || [] // 선택
      };

      const response = await fetch(`${API_BASE_URL}/merchants/popups/preview`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(requestData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('AI 팝업 미리보기 실패:', error);
      throw error;
    }
  }
}

export default ApiService;
