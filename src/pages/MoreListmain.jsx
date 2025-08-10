import React from 'react'
import styled from 'styled-components'
import SearchBox from '../components/home/SearchBox'
import Footer from '../components/common/Footer';
import EventCardList from '../components/common/EventCardList';
import dummyEvents from '../assets/dummy.json'


function MoreListmain() {
  return (
    <Container>
      <SearchBox />
      <SectionHeader>
        <Title>
          <Maintitle>나의 취향맞춤 가게 이벤트</Maintitle>
        </Title>
      </SectionHeader>
      <EventCardList events={dummyEvents.categories}/>
      <Footer/>
    </Container>
  )
}

export default MoreListmain

const Container = styled.main`
  padding: 2rem;
`;
const SectionHeader = styled.div`
  display: flex;
  margin-top: 2rem;
  padding: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const Subtitle = styled.div`
  color: #262626;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
`;
const Maintitle = styled.div`
  color: #262626;
  font-size: 26px;
  font-style: normal;
  font-weight: 600;
  line-height: 32.5px;
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
`;


