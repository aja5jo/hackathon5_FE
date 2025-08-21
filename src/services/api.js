const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// API 요청 헬퍼 함수
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
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
  getFavorites: () => apiRequest('/api/favorites'),
  
  // 즐겨찾기 추가
  addFavorite: (data) => apiRequest('/api/favorites', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // 즐겨찾기 삭제
  removeFavorite: (id) => apiRequest(`/api/favorites/${id}`, {
    method: 'DELETE',
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
  
  // 이벤트 목록 조회
  getEvents: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/events?${queryString}`);
  },
  
  // 이벤트 상세 정보 조회
  getEventDetail: (id) => apiRequest(`/api/events/${id}`),
};

// 사용자 인증 관련 API
export const authAPI = {
  // 로그인
  login: (credentials) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  // 회원가입
  register: (userData) => apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // 로그아웃
  logout: () => apiRequest('/api/auth/logout', {
    method: 'POST',
  }),
  
  // 사용자 정보 조회
  getProfile: () => apiRequest('/api/auth/profile'),
};