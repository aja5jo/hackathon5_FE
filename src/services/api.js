const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // 세션 기반 인증
      ...options,
    };

    // 로그인 토큰이 있다면 추가 (Bearer 토큰 방식)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ===== 소상공인 가게 관련 API =====
  
  /**
   * 가게 등록 (POST /api/merchants/stores)
   * 명세서: StoreCreateRequest DTO 구조에 맞춤
   */
  async createStore(storeData) {
    // 명세서의 StoreCreateRequest DTO 구조에 맞게 데이터 구성
    const requestData = {
      name: storeData.name,
      address: storeData.address,
      number: storeData.number,
      intro: storeData.intro,
      category: storeData.category,
      thumbnail: storeData.thumbnail,
      images: storeData.images || [],
      startTime: storeData.startTime,
      endTime: storeData.endTime
    };

    return this.request('/api/merchants/stores', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  /**
   * 내 가게 정보 조회 (GET /api/merchants/stores)
   * 명세서: StoreCreateResponse DTO 구조로 응답
   */
  async getMyStores() {
    return this.request('/api/merchants/stores', {
      method: 'GET',
    });
  }

  /**
   * 가게 정보 전체 수정 (PUT /api/merchants/stores/{storeId})
   * 명세서: StoreCreateRequest DTO 구조에 맞춤
   */
  async updateStore(storeId, storeData) {
    // 명세서의 StoreCreateRequest DTO 구조에 맞게 데이터 구성
    const requestData = {
      name: storeData.name,
      address: storeData.address,
      number: storeData.number,
      intro: storeData.intro,
      category: storeData.category,
      thumbnail: storeData.thumbnail,
      images: storeData.images || [],
      startTime: storeData.startTime,
      endTime: storeData.endTime
    };

    return this.request(`/api/merchants/stores/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  }

  /**
   * 가게 정보 부분 수정 (PATCH /api/merchants/stores/{storeId})
   * 명세서: StoreUpdateRequest DTO 구조에 맞춤 (null 허용)
   */
  async patchStore(storeId, storeData) {
    // 명세서의 StoreUpdateRequest DTO 구조에 맞게 데이터 구성
    // null 값은 제외하고 전송
    const requestData = {};
    
    if (storeData.name !== undefined) requestData.name = storeData.name;
    if (storeData.address !== undefined) requestData.address = storeData.address;
    if (storeData.number !== undefined) requestData.number = storeData.number;
    if (storeData.intro !== undefined) requestData.intro = storeData.intro;
    if (storeData.category !== undefined) requestData.category = storeData.category;
    if (storeData.thumbnail !== undefined) requestData.thumbnail = storeData.thumbnail;
    if (storeData.images !== undefined) requestData.images = storeData.images;
    if (storeData.startTime !== undefined) requestData.startTime = storeData.startTime;
    if (storeData.endTime !== undefined) requestData.endTime = storeData.endTime;

    return this.request(`/api/merchants/stores/${storeId}`, {
      method: 'PATCH',
      body: JSON.stringify(requestData),
    });
  }

  // ===== 소상공인 이벤트 관련 API =====
  
  async createEvent(storeId, eventData) {
    return this.request(`/api/merchants/stores/${storeId}/events`, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getMyEvents() {
    return this.request('/api/merchants/stores/events', {
      method: 'GET',
    });
  }

  async updateEvent(eventId, eventData) {
    return this.request(`/api/merchants/stores/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async patchEvent(eventId, eventData) {
    return this.request(`/api/merchants/stores/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    });
  }

  // ===== 소상공인 팝업 관련 API =====
  
  async createPopup(popupData) {
    return this.request('/api/merchants/popups', {
      method: 'POST',
      body: JSON.stringify(popupData),
    });
  }

  async getMyPopups() {
    return this.request('/api/merchants/popups', {
      method: 'GET',
    });
  }

  async updatePopup(popupId, popupData) {
    return this.request(`/api/merchants/popups/${popupId}`, {
      method: 'PUT',
      body: JSON.stringify(popupData),
    });
  }

  async patchPopup(popupId, popupData) {
    return this.request(`/api/merchants/popups/${popupId}`, {
      method: 'PATCH',
      body: JSON.stringify(popupData),
    });
  }

  // ===== 번역 API =====
  
  async translateText(text, targetLanguage = 'en') {
    return this.request('/api/translate', {
      method: 'POST',
      body: JSON.stringify({
        text,
        targetLanguage,
      }),
    });
  }
}

export default new ApiService();