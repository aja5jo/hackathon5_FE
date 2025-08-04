import React from 'react'
import styled from 'styled-components'
import BannerSection from '../components/home/BannerSection'
import SearchBox from '../components/home/SearchBox'
import EventCardList from '../components/home/EventCardList';
import Footer from '../components/home/Footer';

//리스트 더미데이터
const dummyEvents = [
  {
    label: '진행중',
    title: '사차 베이커리 팝업',
    text: '이거진짜맛있어요',
    period: '25.03.08(월) ~ 25.04.11(목)',
  },
  {
    label: '추천',
    title: '멋쟁이 KPOP',
    period: '25.03.08(수) ~ 25.04.12(금)',
  },
  {
    label: '추천',
    title: '멋쟁이 KPOP',
    text: '이거진짜맛있어요',
    period: '25.03.08(수) ~ 25.04.12(금)',
  },
  {
    label: '추천',
    title: '멋쟁이 KPOP',
    period: '25.03.08(수) ~ 25.04.12(금)',
  },
  {
    label: '추천',
    title: '멋쟁이 KPOP',
    period: '25.03.08(수) ~ 25.04.12(금)',
  },
  {
    label: '추천',
    title: '멋쟁이 KPOP',
    text: '이거진짜맛있어요',
    period: '25.03.08(수) ~ 25.04.12(금)',
  },
  {
    label: '추천',
    title: '멋쟁이 KPOP',
    period: '25.03.08(수) ~ 25.04.12(금)',
  },
  {
    label: '추천',
    title: '멋쟁이 KPOP',
    period: '25.03.08(수) ~ 25.04.12(금)',
  },
  {
    label: '추천',
    title: '멋쟁이 KPOP',
    text: '이거진짜맛있어요',
    period: '25.03.08(수) ~ 25.04.12(금)',
  },
  {
    label: '추천',
    title: '멋쟁이 KPOP',
    period: '25.03.08(수) ~ 25.04.12(금)',
  },
  {
    label: '추천',
    title: '멋쟁이 KPOP',
    period: '25.03.08(수) ~ 25.04.12(금)',
  },
];

function Home() {
  return (
    <HomeContainer>
      <BannerSection />
      <SearchBox />
      <SectionHeader>
        <h3>아자오조 서비스 이름</h3>
        <h2>나의 취향맞춤 가게 이벤트</h2>
      </SectionHeader>
      <EventCardList events={dummyEvents}/>
      <Footer/>
    </HomeContainer>
  )
}

export default Home

const HomeContainer = styled.main`
  padding: 2rem;
`;
const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
`;
