import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('user'); // 'user' or 'merchant'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 복원
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      const type = savedUserType || (userData.role === 'MERCHANT' ? 'merchant' : 'user');
      setUserType(type);
    } else if (savedUserType) {
      setUserType(savedUserType);
    }
    
    // 로딩 완료
    setIsLoading(false);
  }, []);

  const login = useCallback((userData, type = 'user') => {
    console.log('AuthContext login 함수 호출됨:', userData, type);
    
    // 이전 사용자의 카테고리 데이터 삭제
    localStorage.removeItem('selectedCategories');
    console.log('이전 사용자 카테고리 데이터 삭제됨');
    
    setUser(userData);
    setUserType(type);
    
    // localStorage에 저장
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
    
    console.log('AuthContext 로그인 완료 - user:', userData, 'userType:', type);
    console.log('localStorage 저장됨 - user:', localStorage.getItem('user'), 'userType:', localStorage.getItem('userType'));
  }, []);



  const logout = useCallback(async () => {
    console.log('로그아웃 시도');
    
    // ===== 현재 로컬 로그아웃 버전 (실제 사용 중) =====
    // 로컬 상태 정리
    setUser(null);
    setUserType('user');
    
    // 모든 스토리지에서 제거
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('selectedCategories'); // 카테고리 데이터도 삭제
    sessionStorage.removeItem('user');
    
    console.log('로그아웃 완료');
    
    // 페이지 새로고침하여 상태 초기화
    window.location.reload();
    
    // ===== 백엔드 배포 시 API 버전 (주석처리) =====
    /*
    try {
      const result = await authAPI.logout();
      
      if (result.success) {
        console.log('백엔드 로그아웃 성공:', result.message);
      } else {
        console.warn('백엔드 로그아웃 실패:', result.message);
      }
    } catch (error) {
      console.warn('백엔드 로그아웃 중 오류:', error);
    } finally {
      // 백엔드 성공/실패와 관계없이 로컬 상태 정리
      setUser(null);
      setUserType('user');
      
      // 모든 스토리지에서 제거
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('selectedCategories'); // 카테고리 데이터도 삭제
      sessionStorage.removeItem('user');
      
      console.log('로그아웃 완료');
      
      // 페이지 새로고침하여 상태 초기화
      window.location.reload();
    }
    */
  }, []);

  const isMerchant = useMemo(() => userType === 'merchant', [userType]);

  const isAuthenticated = useMemo(() => user !== null, [user]);

  const value = useMemo(() => ({
    user,
    userType,
    isLoading,
    login,
    logout,
    isMerchant,
    isAuthenticated,
  }), [user, userType, isLoading, login, logout, isMerchant, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};