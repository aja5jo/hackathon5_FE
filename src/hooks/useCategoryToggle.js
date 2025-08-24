import { useState, useCallback } from 'react';
import { categoriesAPI } from '../services/api';

// 카테고리 토글을 위한 커스텀 훅
export const useCategoryToggle = (onSuccess, onError) => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleCategory = useCallback(async (categoryId, currentCategories = [], maxCategories = 3) => {
    // 3개 제한 로직: 이미 3개가 선택되어 있고, 새로운 카테고리를 추가하려는 경우
    if (!currentCategories.includes(categoryId) && currentCategories.length >= maxCategories) {
      return { success: false, message: '최대 3개까지만 선택할 수 있습니다.' };
    }

    try {
      setIsLoading(true);
      const result = await categoriesAPI.toggleCategory(categoryId);
      
      if (result.success) {
        console.log('카테고리 토글 성공:', result.message);
        if (onSuccess) {
          onSuccess(result);
        }
        return result;
      } else {
        let errorMessage = result.message || '카테고리 설정에 실패했습니다.';
        
        if (result.code === 400) {
          errorMessage = result.message || '카테고리 설정에 실패했습니다.';
        } else if (result.code === 401) {
          errorMessage = '로그인이 필요합니다.';
        } else if (result.code === 403) {
          errorMessage = '접근 권한이 없습니다.';
        }
        
        // alert 제거하고 에러를 throw
        const error = new Error(errorMessage);
        if (onError) {
          onError(error);
        }
        throw error;
      }
      
    } catch (error) {
      console.error('카테고리 설정 API 오류:', error);
      // alert 제거하고 에러를 throw
      if (onError) {
        onError(error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  return { toggleCategory, isLoading };
};

// 카테고리 매핑 유틸리티
export const categoryMapping = {
  // 한국어 -> 영어
  koreanToEnglish: {
    '카페': 'CAFE',
    '맛집 & 술집': 'FOOD',
    'KPOP': 'K_POP',
    '오락': 'ENTERTAINMENT',
    '쇼핑': 'SHOPPING',
    '클럽': 'CLUB',
    '기타': 'ETC'
  },
  // 영어 -> 한국어
  englishToKorean: {
    'CAFE': '카페',
    'FOOD': '맛집 & 술집',
    'K_POP': 'KPOP',
    'ENTERTAINMENT': '오락',
    'SHOPPING': '쇼핑',
    'CLUB': '클럽',
    'ETC': '기타'
  }
};
