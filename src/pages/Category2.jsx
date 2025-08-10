//메인 탭에서 보이는 카테고리 페이지
import React, { useState } from 'react'
import styled from 'styled-components';
import Footer from '../components/common/Footer';
import CategoryBannerSection from '../components/category2/CategoryBannerSection';
import dummyEvents from '../assets/dummy.json'
import EventCardList from '../components/common/EventCardList';
import EventCardListCategory from '../components/category2/EventCardListCategory.jsx';

function Category2() {

  const [selected ,setSelected]=useState([]);
  const categoryList = ['카페', '맛집 & 술집', 'KPOP', '오락', '쇼핑', '클럽', '기타'];

  const toggle = (category)=>{
    setSelected(prev =>prev.includes(category)
    ? prev.filter(c => c !== category)
    : [...prev, category]);
  };

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
        <EventCardListCategory events={dummyEvents.categories}/>
      </CategorySection>
      {/* <EventCardList events={dummyEvents}/> */}
      <Footer/>
    </Container>
  )
}

export default Category2

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
