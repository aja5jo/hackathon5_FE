import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styled from 'styled-components'
import mainBannerImg from '../../assets/main_banner.png.png'

const HomeBannerSection = () => {
  return (
    <Wrapper>
        <ArrowButton><FaChevronLeft /></ArrowButton>
        <BannerText>
        </BannerText>
        <ArrowButton><FaChevronRight /></ArrowButton>
    </Wrapper>
  )
}

export default HomeBannerSection

const Wrapper = styled.section`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4rem 1rem;
    aspect-ratio: 4 / 1;
    background: 
        linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%),
        url(${mainBannerImg});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
`;

const BannerText = styled.div`
  text-align: center;
  flex: 1;
  font-size: 1.4rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  strong {
    display: block;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.3rem 0;
    color: rgba(255, 255, 255, 0.9);
  }
`;