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

  // 홈 페이지 데이터 업데이트
  static async updateHomeData() {
    try {
      const response = await fetch(`${API_BASE_URL}/home/update`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('이벤트 데이터 가져오기 실패:', error);
      throw error;
    }
  }

  // 팝업 데이터 가져오기
  static async getPopups(filter = 'all') {
    try {
      const response = await fetch(`${API_BASE_URL}/popups?filter=${filter}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('이벤트 즐겨찾기 추가 실패:', error);
      throw error;
    }
  }

  // 즐겨찾기 추가 (팝업)
  static async addPopupToFavorites(popupId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/events/${popupId}/favorites`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('팝업 즐겨찾기 추가 실패:', error);
      throw error;
    }
  }

  // 즐겨찾기 제거
  static async removeFromFavorites(itemId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites/${itemId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('즐겨찾기 목록 가져오기 실패:', error);
      throw error;
    }
  }

  // 검색 API
  static async search(keyword) {
    try {
      const response = await fetch(`${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('검색 실패:', error);
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('카테고리 목록 가져오기 실패:', error);
      throw error;
    }
  }

  // 특정 카테고리 가져오기
  static async getCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${category}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('카테고리 가져오기 실패:', error);
      throw error;
    }
  }

  // 사용자 카테고리 설정/수정/삭제 (토글 방식)
  static async toggleUserCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/categories/${category}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('사용자 카테고리 설정 실패:', error);
      throw error;
    }
  }

  // 사용자 정보 가져오기
  static async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
      throw error;
    }
  }

  // 로그아웃
  static async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  }

  // 회원가입 API
  static async signup(email, password, role) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          role: role
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  }

  // 로그인 API
  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  }

  // 소상공인 이벤트 등록 API
  static async createMerchantEvent(eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/stores/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('소상공인 이벤트 등록 실패:', error);
      throw error;
    }
  }

  // 소상공인 이벤트 조회 API
  static async getMerchantEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/stores/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('소상공인 이벤트 조회 실패:', error);
      throw error;
    }
  }

  // 소상공인 특정 이벤트 조회 API
  static async getMerchantEvent(eventId) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/stores/events/${eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('소상공인 특정 이벤트 조회 실패:', error);
      throw error;
    }
  }

  // 소상공인 이벤트 수정 API
  static async updateMerchantEvent(eventId, eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/stores/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('소상공인 이벤트 수정 실패:', error);
      throw error;
    }
  }

  // 소상공인 이벤트 부분 수정 API (PATCH)
  static async patchMerchantEvent(eventId, eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/stores/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('소상공인 이벤트 부분 수정 실패:', error);
      throw error;
    }
  }

  // 소상공인 팝업 등록 API
  static async createMerchantPopup(popupData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merchants/popups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(popupData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('소상공인 팝업 등록 실패:', error);
      throw error;
    }
  }
}

export default ApiService;
