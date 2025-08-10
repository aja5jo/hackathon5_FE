import React from 'react'
import styled from 'styled-components';
import Footer from '../components/common/Footer';
import dummyEvents from '../assets/dummy.json'

function Lookmore() {
  return (
    <Container>
      <EventCardList events={dummyEvents}/>
      <Footer/>
    </Container>
  )
}

export default Lookmore

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
`
