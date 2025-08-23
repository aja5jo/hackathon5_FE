const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 환경변수 디버깅
console.log('환경변수 확인:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_BASE_URL: API_BASE_URL
});

// API 요청 헬퍼 함수
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 실제 요청 URL 로그
  console.log('API 요청 URL:', url);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }
  
  return response.json();
};

// 즐겨찾기 관련 API
export const favoritesAPI = {
  // 즐겨찾기 목록 조회
  getFavorites: () => apiRequest('/api/users/favorites'),
  
  // 가게 즐겨찾기 토글
  toggleStoreFavorite: (storeId) => apiRequest(`/api/users/stores/${storeId}/favorites`, {
    method: 'POST',
  }),
  
  // 이벤트 즐겨찾기 토글
  toggleEventFavorite: (eventId) => apiRequest(`/api/users/events/${eventId}/favorites`, {
    method: 'POST',
  }),
  
  // 팝업 즐겨찾기 토글
  togglePopupFavorite: (popupId) => apiRequest(`/api/users/events/${popupId}/favorites`, {
    method: 'POST',
  }),
};

// 버킷리스트 관련 API
export const bucketListAPI = {
  // 버킷리스트 목록 조회
  getBucketList: () => apiRequest('/api/bucketlist'),
  
  // 버킷리스트 추가
  addBucketItem: (data) => apiRequest('/api/bucketlist', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // 버킷리스트 완료 상태 변경
  toggleComplete: (id) => apiRequest(`/api/bucketlist/${id}/toggle`, {
    method: 'PUT',
  }),
  
  // 버킷리스트 삭제
  removeBucketItem: (id) => apiRequest(`/api/bucketlist/${id}`, {
    method: 'DELETE',
  }),
};

// 가게/이벤트 관련 API
export const storesAPI = {
  // 가게 목록 조회
  getStores: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/stores?${queryString}`);
  },
  
  // 가게 상세 정보 조회
  getStoreDetail: (id) => apiRequest(`/api/stores/${id}`),
  
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
  
  // 이벤트 생성
  createEvent: (data) => apiRequest('/api/merchants/stores/events', {
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
  
  // AI 이벤트 미리보기
  previewEventAi: (data) => apiRequest('/api/merchants/stores/events/preview', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // AI 팝업 미리보기
  previewPopupAi: (data) => apiRequest('/api/merchants/popups/preview', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // 가게 삭제
  deleteStore: (id) => apiRequest(`/api/merchants/stores/${id}`, {
    method: 'DELETE',
  }),
  
  // 사업자 프로필 업데이트
  updateProfile: (data) => apiRequest('/api/merchants/profile', {
    method: 'PUT',
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
  
  // 사용자 정보 조회
  getProfile: () => apiRequest('/api/profile'),
};

// 카테고리 관련 API
export const categoriesAPI = {
  // 사용자 카테고리 토글 (삭제/추가)
  toggleUserCategory: (category) => apiRequest(`/api/users/categories/${category}`, {
    method: 'POST',
  }),
  
  // 사용자 카테고리 조회
  getUserCategories: () => apiRequest('/api/users/categories'),
  
  // 카테고리 목록 조회
  getCategories: () => apiRequest('/api/categories'),
  
  // 특정 카테고리 조회
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

// 이벤트/팝업 관련 API
export const eventsAPI = {
  // 전체 이벤트 목록 조회
  getEvents: () => apiRequest('/api/events'),
  
  // 필터별 이벤트 목록 조회
  getEventsByFilter: (filter) => apiRequest(`/api/events?filter=${encodeURIComponent(filter)}`),
  
  // 팝업 목록 조회
  getPopups: () => apiRequest('/api/popups'),
};

// AI 번역 관련 API
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