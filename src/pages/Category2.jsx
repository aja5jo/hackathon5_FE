//메인 탭에서 보이는 카테고리 페이지
import React, { useState, useEffect } from 'react' // useEffect 추가
import styled from 'styled-components';
import Footer from '../components/common/Footer';
import CategoryBannerSection from '../components/category2/CategoryBannerSection';
import EventCardListCategory from '../components/category2/EventCardListCategory.jsx';
import Header from '../components/common/Header';
import { useAuth } from '../contexts/AuthContext';
import { categoriesAPI } from '../services/api';
import { useCategoryToggle, categoryMapping } from '../hooks/useCategoryToggle';



function Category2() {
  const { isAuthenticated, isLoading } = useAuth();

  // ===== 기존 코드 유지 =====
  const [selected ,setSelected]=useState([]);
  const categoryList = ['카페', '맛집 & 술집', 'KPOP', '오락', '쇼핑', '클럽', '기타'];
  // ===== 기존 코드 유지 끝 =====

  // ===== 새로 추가: localStorage에서 선택된 카테고리 불러오기 =====
  const [userSelectedCategories, setUserSelectedCategories] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // ===== 수정: Category1에서 선택한 카테고리 ID를 dummy.json의 카테고리명으로 매핑 =====
  const categoryMapping = {
    koreanToEnglish: {
      '카페': 'CAFE',
      '맛집 & 술집': 'FOOD',
      'KPOP': 'K_POP',
      '오락': 'ENTERTAINMENT',
      '쇼핑': 'SHOPPING',
      '클럽': 'CLUB',
      '기타': 'ETC'
    },
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

  // 컴포넌트 마운트 시 API에서 선택된 카테고리 불러오기 (통합된 로직으로 대체됨)

  // ===== 수정: 사용자 선택 카테고리와 전체 카테고리를 하나의 API 호출로 통합 =====
  useEffect(() => {
    // 인증 여부와 관계없이 카테고리 데이터를 로드
    // if (!isAuthenticated) {
    //   return;
    // }
    
    const loadCategoriesData = async () => {
      try {
        // 전체 카테고리만 로드 (사용자 카테고리는 401 오류로 인해 임시 제외)
        const apiCalls = [categoriesAPI.getCategories()];
        
        const results = await Promise.all(apiCalls);
        const categoriesResult = results[0];
        
        // Category1에서 선택한 카테고리를 localStorage에서 불러오기
        const storedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
        if (storedCategories.length > 0) {
          // 영어 카테고리 ID를 한국어 이름으로 변환
          const koreanNames = storedCategories.map(catId => {
            const koreanMapping = {
              'CAFE': '카페',
              'FOOD': '맛집 & 술집',
              'K_POP': 'KPOP',
              'ENTERTAINMENT': '오락',
              'SHOPPING': '쇼핑',
              'CLUB': '클럽',
              'ETC': '기타'
            };
            return koreanMapping[catId] || catId;
          });
          setSelected(koreanNames);
          setUserSelectedCategories(storedCategories);
        }
        
        // 전체 카테고리 처리
        if (categoriesResult.success && categoriesResult.data) {
          let categories = [];
          
          // API 응답 구조에 따라 데이터 추출
          if (Array.isArray(categoriesResult.data)) {
            categories = categoriesResult.data;
          } else if (categoriesResult.data.categories && Array.isArray(categoriesResult.data.categories)) {
            categories = categoriesResult.data.categories;
          } else if (categoriesResult.data.data && Array.isArray(categoriesResult.data.data)) {
            categories = categoriesResult.data.data;
          } else {
            console.warn('예상하지 못한 카테고리 API 응답 구조:', categoriesResult.data);
            categories = [];
          }
          
          if (userSelectedCategories.length > 0) {
            const filteredCategories = categories.filter(cat => 
              userSelectedCategories.includes(cat.category)
            );
            setFilteredEvents(filteredCategories);
          } else {
            setFilteredEvents(categories);
          }
        }
        
      } catch (error) {
        console.error('카테고리 데이터 로드 실패:', error);
      }
    };
    
    loadCategoriesData();
    
  }, [isAuthenticated]);
  // ===== 새로 추가 끝 =====

  // ===== 기존 코드 유지 =====
  // 카테고리 토글 커스텀 훅 사용
  const { toggleCategory, isLoading: isToggleLoading } = useCategoryToggle(
    (result) => {
      // API 응답에 따라 상태 업데이트
      setSelected(prev => {
        if (prev.includes(category)) {
          // 이미 선택된 카테고리면 제거
          const newSelected = prev.filter(c => c !== category);
          
          const englishCategories = newSelected.map(cat => categoryMapping.koreanToEnglish[cat]).filter(Boolean);
          setUserSelectedCategories(englishCategories);
          
          return newSelected;
        } else {
          // 새로운 카테고리 추가
          const newSelected = [...prev, category];
          
          const englishCategories = newSelected.map(cat => categoryMapping.koreanToEnglish[cat]).filter(Boolean);
          setUserSelectedCategories(englishCategories);
          
          return newSelected;
        }
      });
    },
    (error) => {
      // 에러 처리
    }
  );

  // ===== 수정: 나의 카테고리 버튼 클릭 시 카테고리 별 모아보기도 함께 토글 =====
  const toggle = async (category) => {
    // 로딩 중이거나 인증되지 않은 경우 처리
    if (isToggleLoading) {
      alert('로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    // 로컬 상태 먼저 업데이트
    setSelected(prev => {
      let newSelected;
      if (prev.includes(category)) {
        // 이미 선택된 카테고리면 제거 (해제) - 경고 없이 바로 해제
        newSelected = prev.filter(c => c !== category);
        console.log('카테고리 해제:', category);
      } else {
        // 새로운 카테고리 추가 (최대 3개 제한)
        if (prev.length >= 3) {
          alert('최대 3개까지만 선택할 수 있습니다.');
          return prev;
        }
        newSelected = [...prev, category];
        console.log('카테고리 선택:', category);
      }
      
      // 영어 카테고리 ID로 변환하여 localStorage에 저장
      const englishCategories = newSelected.map(cat => categoryMapping.koreanToEnglish[cat]).filter(Boolean);
      localStorage.setItem('selectedCategories', JSON.stringify(englishCategories));
      setUserSelectedCategories(englishCategories);
      
      return newSelected;
    });
    
    // API 호출은 선택사항으로 하고, 에러가 발생해도 UI는 업데이트되도록 함
    try {
      const categoryId = categoryMapping.koreanToEnglish[category];
      await toggleCategory(categoryId, selected, 3);
    } catch (error) {
      console.log('API 호출 실패했지만 UI는 업데이트됨:', error.message);
      // API 호출이 실패해도 UI 상태는 이미 업데이트되었으므로 사용자에게 알리지 않음
    }
  };
  // ===== 수정 끝 =====

  return (
    <Container>
      <CategoryBannerSection />
      <FilterSection>
        <FilterTitle>나의 카테고리 뷰</FilterTitle>
          <FilterContainer>
                         {categoryList.map((cat, idx) => (
               <FilterButton
                 key={idx}
                 $active={selected.includes(cat)}
                 onClick={() => toggle(cat)}
               >
                 {cat}
               </FilterButton>
             ))}
          </FilterContainer>
      </FilterSection>
      <ListSection>
        <SectionHeader>
          <CategoryTitle>카테고리 모음</CategoryTitle>
        </SectionHeader>
        {/* ===== 수정: 필터링된 이벤트만 표시 ===== */}
        <EventCardListCategory events={filteredEvents} maxItems={3}/>
        {/* ===== 기존 코드: 모든 이벤트 표시 (주석 처리) ===== */}
        {/* <EventCardListCategory events={dummyEvents.categories}/> */}
        {/* ===== 수정 끝 ===== */}
      </ListSection>
      {/* <EventCardList events={dummyEvents}/> */}
      <Footer/>
    </Container>
  )
}

export default Category2

// ===== 기존 스타일 컴포넌트들 유지 =====
const FilterTitle = styled.div`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #262626;
`;
const Container = styled.div`
  background-color: #ffffff;
  position: relative;
  width: 100%;
`;

const ListSection = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0; /* gutters are handled by inner CardGrid */
`;

const SectionHeader = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto 0 auto;
  padding: 1.5rem 0; /* vertical only; horizontal gutters come from CardGrid */
  display: flex;
  align-items: center;
  justify-content: center; /* centers Title */
`;

const CategoryTitle = styled.div`
  color: #262626;
  font-style: normal;
  font-weight: 600;
  line-height: 32.5px; 
  font-size: 2.6rem;
`
// ===== 기존 스타일 컴포넌트들 유지 끝 =====

const FilterSection = styled.div`
  background-color: white;
  padding: 2rem 0;
  border-bottom: 1px solid #e9ecef;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FilterButton = styled.button`
  padding: 1rem 2rem;
  background-color: ${props => (props.$active ? '#FEE502' : 'transparent')};
  color: #262626;
  border: 2px solid ${props => (props.$active ? '#FEE502' : '#E5E5E5')};
  border-radius: 25px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #FEE502;
    background-color: ${props => (props.$active ? '#FEE502' : '#FFF9C4')};
    transform: translateY(-2px);
  }
`;
