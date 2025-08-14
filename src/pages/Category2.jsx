//메인 탭에서 보이는 카테고리 페이지
import React, { useState, useEffect } from 'react' // useEffect 추가
import styled from 'styled-components';
import Footer from '../components/common/Footer';
import CategoryBannerSection from '../components/category2/CategoryBannerSection';
import dummyEvents from '../assets/dummy.json'
import EventCardList from '../components/common/EventCardList';
import EventCardListCategory from '../components/category2/EventCardListCategory.jsx';

function Category2() {

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
      const koreanToEnglishMapping = {
        '카페': 'CAFE',
        '맛집 & 술집': 'FOOD',
        'KPOP': 'K_POP',
        '오락': 'ENTERTAINMENT',
        '쇼핑': 'SHOPPING',
        '클럽': 'CLUB',
        '기타': 'ETC'
      };
      
      const englishCategories = newSelected.map(cat => koreanToEnglishMapping[cat]).filter(Boolean);
      setUserSelectedCategories(englishCategories);
      
      return newSelected;
    });
  };
  // ===== 수정 끝 =====

  return (
    <Container>
      <CategoryBannerSection />
      <SectionHeader>
        <Subtitle>나의 카테고리</Subtitle>
        <ButtonWrapper>
          {categoryList.map((cat,idx)=>(
            <CategoryButton
              key={idx}
              selected ={selected.includes(cat)}
              onClick={()=>toggle(cat)} >
                {cat}
            </CategoryButton>
          ))}
        </ButtonWrapper>
      </SectionHeader>

      <CategorySection>
        <CategoryTitle>카테고리 별 모아보기</CategoryTitle>
        {/* ===== 수정: 필터링된 이벤트만 표시 ===== */}
        <EventCardListCategory events={filteredEvents}/>
        {/* ===== 기존 코드: 모든 이벤트 표시 (주석 처리) ===== */}
        {/* <EventCardListCategory events={dummyEvents.categories}/> */}
        {/* ===== 수정 끝 ===== */}
      </CategorySection>
      {/* <EventCardList events={dummyEvents}/> */}
      <Footer/>
    </Container>
  )
}

export default Category2

// ===== 기존 스타일 컴포넌트들 유지 =====
const Container = styled.main`
  padding: 2rem;
`;
const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
`;
const Subtitle = styled.div`
  color: #262626;
  font-size: 2.6rem;
  font-style: normal;
  font-weight: 600;
  line-height: 32.5px;
`;
const ButtonWrapper = styled.div`
  display: flex;
  //justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CategoryButton = styled.button`
  padding: 0.6rem 1.4rem;
  border-radius: 20px;
  border: 2px solid #000;
  background-color: ${props => (props.selected ? ' rgba(254, 229, 32, 0.50);' : 'white')};
  color: ${props => (props.selected ? 'black' : 'black')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
`;

const CategoryTitle = styled.div`
  color: #262626;
  font-style: normal;
  font-weight: 600;
  line-height: 32.5px; 
  font-size: 2.6rem;
`
// ===== 기존 스타일 컴포넌트들 유지 끝 =====
