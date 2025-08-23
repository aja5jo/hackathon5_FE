//메인 탭에서 보이는 카테고리 페이지
import React, { useState, useEffect } from 'react' // useEffect 추가
import styled from 'styled-components';
import Footer from '../components/common/Footer';
import CategoryBannerSection from '../components/category2/CategoryBannerSection';
import dummyEvents from '../assets/dummy.json'
import EventCardListCategory from '../components/category2/EventCardListCategory.jsx';
import { useAuth } from '../contexts/AuthContext';
import { categoriesAPI } from '../services/api';



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
    'cafe': 'CAFE',
    'restaurant': 'FOOD',
    'kpop': 'K_POP',
    'entertainment': 'ENTERTAINMENT',
    'shopping': 'SHOPPING',
    'club': 'CLUB',
    'etc': 'ETC'
  };

  // 컴포넌트 마운트 시 localStorage에서 선택된 카테고리 불러오기
  useEffect(() => {
    // 인증되지 않은 경우 API 호출하지 않음
    if (!isAuthenticated) {
      return;
    }
    
    // ===== 더미데이터 버전 (주석처리) =====
    /*
    const savedCategories = localStorage.getItem('selectedCategories');
    if (savedCategories) {
      const categoryIds = JSON.parse(savedCategories);
      // ===== 수정: 카테고리 ID를 dummy.json의 카테고리명으로 매핑 =====
      const categoryNames = categoryIds.map(id => categoryMapping[id]).filter(Boolean);
      setUserSelectedCategories(categoryNames);
      // ===== 수정: 나의 카테고리 버튼은 한국어 카테고리명으로 설정 =====
      const koreanCategoryNames = categoryIds.map(id => {
        const koreanMapping = {
          'cafe': '카페',
          'restaurant': '맛집 & 술집',
          'kpop': 'KPOP',
          'entertainment': '오락',
          'shopping': '쇼핑',
          'club': '클럽',
          'etc': '기타'
        };
        return koreanMapping[id];
      }).filter(Boolean);
      setSelected(koreanCategoryNames);
    }
    */
    
    // ===== 백엔드 API 버전 (활성화) =====
    const loadUserCategories = async () => {
      try {
        const result = await categoriesAPI.getUserCategories();
        
        if (result.success && result.data && result.data.categories) {
          const categories = result.data.categories;
          
          const userCategories = categories.filter(cat => 
            cat.items && cat.items.some(item => item.liked)
          );
          
          setUserSelectedCategories(userCategories.map(cat => cat.category));
          
          const koreanNames = userCategories.map(cat => {
            const koreanMapping = {
              'CAFE': '카페',
              'FOOD': '맛집 & 술집',
              'K_POP': 'KPOP',
              'ENTERTAINMENT': '오락',
              'SHOPPING': '쇼핑',
              'CLUB': '클럽',
              'ETC': '기타'
            };
            return koreanMapping[cat.category] || cat.category;
          });
          setSelected(koreanNames);
        }
        
      } catch (error) {
        console.error('카테고리 데이터 로드 실패:', error);
      }
    };

    loadUserCategories();
  }, [isAuthenticated]);

  // ===== 수정: 선택된 카테고리에 따라 이벤트 필터링 로직 개선 =====
  useEffect(() => {
    // 인증되지 않은 경우 API 호출하지 않음
    if (!isAuthenticated) {
      return;
    }
    
    // ===== 더미데이터 버전 (주석처리) =====
    /*
    if (userSelectedCategories.length > 0 && dummyEvents.categories) {
      // ===== 수정: 선택된 카테고리의 카테고리 데이터만 필터링 =====
      const filteredCategories = dummyEvents.categories.filter(cat => 
        userSelectedCategories.includes(cat.category)
      );
      setFilteredEvents(filteredCategories);
    } else {
      // 선택된 카테고리가 없으면 모든 카테고리 표시
      setFilteredEvents(dummyEvents.categories || []);
    }
    */
    
    // ===== 백엔드 API 버전 (활성화) =====
    const loadFilteredEventsFromAPI = async () => {
      try {
        const result = await categoriesAPI.getCategories();
        
        if (result.success && result.data && result.data.categories) {
          const categories = result.data.categories;
          
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
        console.error('필터링된 이벤트 로드 실패:', error);
        setFilteredEvents(dummyEvents.categories || []);
      }
    };
    
    loadFilteredEventsFromAPI();
    
  }, [userSelectedCategories, isAuthenticated]);
  // ===== 새로 추가 끝 =====

  // ===== 기존 코드 유지 =====
  // ===== 수정: 나의 카테고리 버튼 클릭 시 카테고리 별 모아보기도 함께 토글 =====
  const toggle = async (category) => {
    // 로딩 중이거나 인증되지 않은 경우 처리
    if (isLoading) {
      alert('로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    // 3개 제한 로직: 이미 3개가 선택되어 있고, 새로운 카테고리를 추가하려는 경우
    if (!selected.includes(category) && selected.length >= 3) {
      alert('최대 3개까지만 선택할 수 있습니다.');
      return;
    }

    try {
      // ===== 백엔드 API 버전 (활성화) =====
      const translatedToEnglishMapping = {
        '카페': 'CAFE',
        '맛집 & 술집': 'FOOD',
        'KPOP': 'K_POP',
        '오락': 'ENTERTAINMENT',
        '쇼핑': 'SHOPPING',
        '클럽': 'CLUB',
        '기타': 'ETC'
      };

      const categoryId = translatedToEnglishMapping[category];
      
      const result = await categoriesAPI.toggleCategory(categoryId);
      
      if (result.success) {
        console.log('카테고리 토글 성공:', result.message);
        
        // API 응답에 따라 상태 업데이트
        setSelected(prev => {
          if (prev.includes(category)) {
            // 이미 선택된 카테고리면 제거
            const newSelected = prev.filter(c => c !== category);
            
            const englishCategories = newSelected.map(cat => translatedToEnglishMapping[cat]).filter(Boolean);
            setUserSelectedCategories(englishCategories);
            
            return newSelected;
          } else {
            // 새로운 카테고리 추가
            const newSelected = [...prev, category];
            
            const englishCategories = newSelected.map(cat => translatedToEnglishMapping[cat]).filter(Boolean);
            setUserSelectedCategories(englishCategories);
            
            return newSelected;
          }
        });
      } else {
        if (result.code === 400) {
          alert(result.message || '카테고리 설정에 실패했습니다.');
        } else if (result.code === 401) {
          alert('로그인이 필요합니다.');
        } else if (result.code === 403) {
          alert('접근 권한이 없습니다.');
        } else {
          alert(result.message || '카테고리 설정 중 오류가 발생했습니다.');
        }
      }
      
    } catch (error) {
      console.error('카테고리 설정 API 오류:', error);
      alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
    }
    
    // ===== 더미데이터 버전 (주석처리) =====
    /*
    setSelected(prev => {
      if (prev.includes(category)) {
        // 이미 선택된 카테고리면 제거
        const newSelected = prev.filter(c => c !== category);
        
        const translatedToEnglishMapping = {
          '카페': 'CAFE',
          '맛집 & 술집': 'FOOD',
          'KPOP': 'K_POP',
          '오락': 'ENTERTAINMENT',
          '쇼핑': 'SHOPPING',
          '클럽': 'CLUB',
          '기타': 'ETC'
        };
        
        const englishCategories = newSelected.map(cat => translatedToEnglishMapping[cat]).filter(Boolean);
        setUserSelectedCategories(englishCategories);
        
        return newSelected;
      } else {
        // 새로운 카테고리 추가 시 3개 제한 확인
        if (prev.length >= 3) {
          alert('최대 3개까지만 선택할 수 있습니다.');
          return prev;
        }
        
        const newSelected = [...prev, category];
        
        const translatedToEnglishMapping = {
          '카페': 'CAFE',
          '맛집 & 술집': 'FOOD',
          'KPOP': 'K_POP',
          '오락': 'ENTERTAINMENT',
          '쇼핑': 'SHOPPING',
          '클럽': 'CLUB',
          '기타': 'ETC'
        };
        
        const englishCategories = newSelected.map(cat => translatedToEnglishMapping[cat]).filter(Boolean);
        setUserSelectedCategories(englishCategories);
        
        return newSelected;
      }
    });
    */
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
                active={selected.includes(cat)}
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
  background-color: ${props => (props.active ? '#FEE502' : 'transparent')};
  color: #262626;
  border: 2px solid ${props => (props.active ? '#FEE502' : '#E5E5E5')};
  border-radius: 25px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #FEE502;
    background-color: ${props => (props.active ? '#FEE502' : '#FFF9C4')};
    transform: translateY(-2px);
  }
`;
