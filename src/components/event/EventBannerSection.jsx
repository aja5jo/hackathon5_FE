import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styled from 'styled-components'
import bannerImg from '../../assets/banner.png'

const EventBannerSection = () => {
  return (
    <Wrapper>
        <BannerText>
            이벤트 한눈에 모아보기
        </BannerText>
    </Wrapper>
  )
}

export default EventBannerSection

const Wrapper = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rem 1rem;
    aspect-ratio: 4 / 1;
    background: 
    linear-gradient(0deg, rgba(102, 92, 14, 0.3) 0%, rgba(102, 92, 14, 0.3) 100%),
    url(${bannerImg});
    background-size: cover;
    background-position: center;
    position: relative;
    
`;

const BannerText = styled.div`
  text-align: center;
  flex: 1;
  color: white;
  display: block;
  font-size: 5rem;
  margin-bottom: 0.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -2px;
`;