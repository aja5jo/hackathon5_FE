const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ggoggobackend.duckdns.org';

// 환경변수 디버깅
console.log('환경변수 확인:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_BASE_URL: API_BASE_URL
});

// 사용자 타입 확인 유틸리티 함수
export const getUserType = () => {
  return localStorage.getItem('userType');
};

export const isMerchant = () => {
  return getUserType() === 'MERCHANT';
};

export const isUser = () => {
  return getUserType() === 'USER';
};

// API 요청 헬퍼 함수
const apiRequest = async (endpoint, options = {}, retryCount = 0) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 실제 요청 URL 로그
  console.log('API 요청 URL:', url);
  
  // 인증 상태 확인
  const user = localStorage.getItem('user');
  const userType = localStorage.getItem('userType');
  console.log('API 요청 시 인증 상태:', { user: user ? JSON.parse(user) : null, userType });
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // 세션 쿠키 포함
  };

  console.log('API 요청 옵션:', { ...defaultOptions, ...options });
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    console.log('API 응답 상태:', response.status, response.statusText);
    console.log('API 응답 헤더:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 401) {
      // 인증 실패 - 콘솔에만 에러 출력
      console.error('인증 실패 (401) - API:', endpoint);
      const errorText = await response.text();
      console.error('401 에러 응답 내용:', errorText);
      
      // JSON 에러 메시지 파싱 시도
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || '인증이 필요합니다.');
      } catch (parseError) {
        throw new Error('인증이 필요합니다.');
      }
    }
    
    if (response.status === 500) {
      // 서버 오류 - 콘솔에만 에러 출력
      console.error('서버 오류 (500) - API:', endpoint);
      const errorText = await response.text();
      console.error('500 에러 응답 내용:', errorText);
      throw new Error('서버 오류가 발생했습니다.');
    }
    
    if (response.status === 403) {
      // 권한 없음 - 콘솔에만 에러 출력
      console.error('권한 없음 (403) - API:', endpoint);
      const errorText = await response.text();
      console.error('403 에러 응답 내용:', errorText);
      throw new Error('접근 권한이 없습니다.');
    }
    
    if (response.status === 404) {
      // 리소스 없음 - 콘솔에만 에러 출력
      console.error('리소스를 찾을 수 없음 (404) - API:', endpoint);
      const errorText = await response.text();
      console.error('404 에러 응답 내용:', errorText);
      throw new Error('리소스를 찾을 수 없습니다.');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답 내용:', errorText);
      
      // JSON 에러 메시지 파싱 시도
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || `API 요청 실패: ${response.status}`);
      } catch (parseError) {
        throw new Error(`API 요청 실패: ${response.status} - ${errorText}`);
      }
    }
    
    return response.json();
    
  } catch (error) {
    // 네트워크 오류나 기타 오류
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('네트워크 오류:', error);
      
      // 재시도 로직 (최대 3회)
      if (retryCount < 3) {
        console.log(`네트워크 오류로 재시도 중... (${retryCount + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000)); // 지수 백오프
        return apiRequest(endpoint, options, retryCount + 1);
      }
      
      console.error('네트워크 연결을 확인해주세요.');
      throw new Error('네트워크 연결 오류');
    }
    
    throw error;
  }
};

// 즐겨찾기 관련 API - 명세서대로
export const favoritesAPI = {
  // 즐겨찾기 목록 조회
  getFavorites: () => {
    if (isMerchant()) {
      throw new Error('소상공인은 즐겨찾기 기능을 사용할 수 없습니다.');
    }
    return apiRequest('/api/users/favorites');
  },
  
  // 가게 즐겨찾기 토글
  toggleStoreFavorite: (storeId) => {
    if (isMerchant()) {
      throw new Error('소상공인은 즐겨찾기 기능을 사용할 수 없습니다.');
    }
    return apiRequest(`/api/users/stores/${storeId}/favorites`, {
      method: 'POST',
    });
  },
  
  // 이벤트 즐겨찾기 토글
  toggleEventFavorite: (eventId) => {
    if (isMerchant()) {
      throw new Error('소상공인은 즐겨찾기 기능을 사용할 수 없습니다.');
    }
    return apiRequest(`/api/users/events/${eventId}/favorites`, {
      method: 'POST',
    });
  },
  
  // 팝업 즐겨찾기 토글 - 명세서에서는 events로 되어있음
  togglePopupFavorite: (popupId) => {
    if (isMerchant()) {
      throw new Error('소상공인은 즐겨찾기 기능을 사용할 수 없습니다.');
    }
    return apiRequest(`/api/users/events/${popupId}/favorites`, {
      method: 'POST',
    });
  },
  
  // 즐겨찾기 제거 (토글 방식으로 처리)
  removeFavorite: (id, type) => {
    if (isMerchant()) {
      throw new Error('소상공인은 즐겨찾기 기능을 사용할 수 없습니다.');
    }
    
    if (type === 'stores') {
      return apiRequest(`/api/users/stores/${id}/favorites`, {
        method: 'POST',
      });
    } else if (type === 'event') {
      return apiRequest(`/api/users/events/${id}/favorites`, {
        method: 'POST',
      });
    } else {
      return apiRequest(`/api/users/events/${id}/favorites`, {
        method: 'POST',
      });
    }
  },
};

// 버킷리스트 관련 API - 명세서에 없으므로 제거
// export const bucketListAPI = {
//   // 명세서에 버킷리스트 API가 없음
// };

// 가게/이벤트 관련 API
export const storesAPI = {
  // 가게 목록 조회
  // getStores: (params = {}) => {
  //   const queryString = new URLSearchParams(params).toString();
  //   return apiRequest(`/api/stores?${queryString}`);
  // },
  
  // 가게 상세 정보 조회
  getStoreDetail: (id) => apiRequest(`/api/store/${id}`),
  
  // 가게 좋아요 토글 (일반 유저만 사용 가능)
  toggleStoreLike: (storeId) => {
    if (isMerchant()) {
      throw new Error('소상공인은 좋아요 기능을 사용할 수 없습니다.');
    }
    return apiRequest(`/api/users/stores/${storeId}/favorites`, {
      method: 'POST',
    });
  },
  
  // 가게 생성
  createStore: (data) => apiRequest('/api/merchants/stores', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // 가게 정보 조회 (소상공인용)
  getMyStores: () => apiRequest('/api/merchants/stores'),
  
  // 가게 전체 수정
  updateStore: (id, data) => apiRequest(`/api/merchants/stores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // 가게 삭제
  deleteStore: (storeId) => apiRequest(`/api/merchants/stores/${storeId}`, {
    method: 'DELETE',
  }),
  
  // 가게 부분 수정
  patchStore: (id, data) => apiRequest(`/api/merchants/stores/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  // 가게 조회 (수정용)
  getStore: (id) => apiRequest(`/api/merchants/stores/${id}`),
  
  // 이벤트 목록 조회
  getEvents: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/events?${queryString}`);
  },
  
  // 이벤트 상세 정보 조회
  getEventDetail: (id) => apiRequest(`/api/events/${id}`),
  
  // 이벤트 생성 - 명세서대로 수정
  createEvent: (data) => apiRequest('/api/merchants/events', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // 이벤트 수정
  updateEvent: (id, data) => apiRequest(`/api/merchants/stores/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // 이벤트 부분 수정
  patchEvent: (id, data) => apiRequest(`/api/merchants/stores/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  // 이벤트 조회 (수정용)
  getEvent: (id) => apiRequest(`/api/merchants/stores/events/${id}`),
  
  // 내 이벤트 목록 조회
  getMyEvents: () => apiRequest('/api/merchants/stores/events'),
  
  // 팝업 생성
  createPopup: (data) => apiRequest('/api/merchants/popups', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // 내 팝업 조회
  getMyPopups: () => apiRequest('/api/merchants/popups'),
  
  // 팝업 전체 수정
  updatePopup: (popupId, data) => apiRequest(`/api/merchants/popups/${popupId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // 팝업 부분 수정
  patchPopup: (popupId, data) => apiRequest(`/api/merchants/popups/${popupId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  // AI 이벤트 미리보기 - 명세서대로
  previewEventAi: (data) => apiRequest('/api/merchants/stores/events/preview', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // AI 팝업 미리보기
  previewPopupAi: (data) => apiRequest('/api/merchants/popups/preview', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
};

// 사용자 인증 관련 API
export const authAPI = {
  // 로그인
  login: (credentials) => apiRequest('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  // 회원가입
  register: (userData) => apiRequest('/api/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // 로그아웃
  logout: () => apiRequest('/api/logout', {
    method: 'POST',
  }),
};

// 카테고리 관련 API
export const categoriesAPI = {
  // 사용자 카테고리 토글 (삭제/추가) - 명세서대로
  toggleCategory: (category) => {
    if (isMerchant()) {
      throw new Error('소상공인은 카테고리 기능을 사용할 수 없습니다.');
    }
    return apiRequest(`/api/users/categories/${category}`, {
      method: 'POST',
    });
  },
  
  // 사용자 카테고리 조회 - 명세서대로
  getUserCategories: () => {
    if (isMerchant()) {
      throw new Error('소상공인은 카테고리 기능을 사용할 수 없습니다.');
    }
    return apiRequest('/api/users/categories');
  },
  
  // 카테고리 목록 조회 - 명세서대로 (모든 사용자 가능)
  getCategories: () => apiRequest('/api/categories'),
  
  // 특정 카테고리 조회 - 명세서대로 (모든 사용자 가능)
  getCategory: (category) => apiRequest(`/api/categories/${category}`),
};

// 메인 페이지 관련 API
export const mainAPI = {
  // 메인 페이지 조회
  getHome: () => apiRequest('/api/home'),
  
  // 메인 페이지 전체 조회
  getHomeDetail: () => apiRequest('/api/home/detail'),
  
  // 가게 상세 조회
  getStoreDetail: (storeId) => apiRequest(`/api/store/${storeId}`),
  
  // 이벤트 상세 조회
  getEventDetail: (eventId) => apiRequest(`/api/event/${eventId}`),
  
  // 팝업 상세 조회
  getPopupDetail: (popupId) => apiRequest(`/api/popup/${popupId}`),
  
  // 검색
  search: (keyword) => apiRequest(`/api/search?keyword=${encodeURIComponent(keyword)}`),
  
  // 홈 업데이트
  updateHome: () => apiRequest('/api/home/update', {
    method: 'POST',
  }),
};

// 이벤트/팝업 관련 API - 명세서대로
export const eventsAPI = {
  // 전체 이벤트 목록 조회
  getEvents: () => apiRequest('/api/events'),
  
  // 개별 이벤트 조회 (누락된 함수)
  getEvent: (eventId) => apiRequest(`/api/event/${eventId}`),
  
  // 이벤트 좋아요 토글 (일반 유저만 사용 가능)
  toggleEventLike: (eventId) => {
    if (isMerchant()) {
      throw new Error('소상공인은 좋아요 기능을 사용할 수 없습니다.');
    }
    return apiRequest(`/api/users/events/${eventId}/favorites`, {
      method: 'POST',
    });
  },
  
  // 필터별 이벤트 목록 조회
  getEventsByFilter: (filter) => apiRequest(`/api/events?filter=${encodeURIComponent(filter)}`),
  
  // 팝업 목록 조회
  getPopups: () => apiRequest('/api/popups'),
  
  // 팝업 자동 삭제 (명세서대로)
  deletePopup: (popupId) => apiRequest(`/api/events/popup/${popupId}`, {
    method: 'DELETE',
  }),
  
  // 팝업 좋아요 토글 (일반 유저만 사용 가능)
  togglePopupLike: (popupId) => {
    if (isMerchant()) {
      throw new Error('소상공인은 좋아요 기능을 사용할 수 없습니다.');
    }
    return apiRequest(`/api/users/popups/${popupId}/favorites`, {
      method: 'POST',
    });
  },
};

// 사용자 관련 API - 명세서에 없으므로 제거
// export const usersAPI = {
//   // 명세서에 없는 API들
// };

// AI 번역 관련 API - 명세서대로
export const translateAPI = {
  // 이미지 번역
  translateImage: (data) => apiRequest('/api/translate/image', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // HTML 번역
  translateHtml: (data) => apiRequest('/api/translate/html/raw', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};