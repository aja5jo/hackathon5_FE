import React from 'react'
import styled from 'styled-components';
import EventBannerSection from '../components/event/EventBannerSection';
import Footer from '../components/common/Footer';

function Event() {
  return (
    <Container>
      <EventBannerSection />
      <Section>
        
      </Section>
      {/* <EventCardList events={dummyEvents}/> */}
      <Footer/>
    </Container>
  )
}

export default Event


const Container = styled.main`
  padding: 2rem;
`;
const Section = styled.div`
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
