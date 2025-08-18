//메인 탭에서 보이는 카테고리 페이지
import React, { useState, useEffect } from 'react' // useEffect 추가
import styled from 'styled-components';
import Footer from '../components/common/Footer';
import CategoryBannerSection from '../components/category2/CategoryBannerSection';
import dummyEvents from '../assets/dummy.json'
import EventCardListCategory from '../components/category2/EventCardListCategory.jsx';
import { useTranslation } from '../utils/translations';

function Category2() {
  const { t } = useTranslation();

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
    const loadUserCategories = () => {
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
    };

    loadUserCategories();
  }, []);

  // ===== 수정: 선택된 카테고리에 따라 이벤트 필터링 로직 개선 =====
  useEffect(() => {
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
  }, [userSelectedCategories]);
  // ===== 새로 추가 끝 =====

  // ===== 기존 코드 유지 =====
  // ===== 수정: 나의 카테고리 버튼 클릭 시 카테고리 별 모아보기도 함께 토글 =====
  const toggle = (category) => {
    setSelected(prev => {
      const newSelected = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      // ===== 수정: 선택된 카테고리를 dummy.json 카테고리명으로 변환하여 필터링 =====
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
    });
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
  min-height: 100vh;
  background-color: #ffffff;
  position: relative;
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
