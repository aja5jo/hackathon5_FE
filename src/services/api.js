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
      ...options,
    };

    // 로그인 토큰이 있다면 추가
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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

  // 소상공인 가게 관련 API
  async createStore(storeData) {
    return this.request('/api/merchants/stores', {
      method: 'POST',
      body: storeData, // FormData
      headers: {
        // FormData는 자동으로 Content-Type 설정됨
      },
    });
  }

  async getMyStores() {
    return this.request('/api/merchants/stores', {
      method: 'GET',
    });
  }

  async updateStore(storeId, storeData) {
    return this.request(`/api/merchants/stores/${storeId}`, {
      method: 'PUT',
      body: storeData,
      headers: {},
    });
  }

  async patchStore(storeId, storeData) {
    return this.request(`/api/merchants/stores/${storeId}`, {
      method: 'PATCH',
      body: JSON.stringify(storeData),
    });
  }

  // 소상공인 이벤트 관련 API
  async createEvent(storeId, eventData) {
    return this.request(`/api/merchants/stores/${storeId}/events`, {
      method: 'POST',
      body: eventData,
      headers: {},
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
      body: eventData,
      headers: {},
    });
  }

  async patchEvent(eventId, eventData) {
    return this.request(`/api/merchants/stores/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    });
  }

  // 소상공인 팝업 관련 API
  async createPopup(popupData) {
    return this.request('/api/merchants/popups', {
      method: 'POST',
      body: popupData,
      headers: {},
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
      body: popupData,
      headers: {},
    });
  }

  async patchPopup(popupId, popupData) {
    return this.request(`/api/merchants/popups/${popupId}`, {
      method: 'PATCH',
      body: JSON.stringify(popupData),
    });
  }

  // 번역 API
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