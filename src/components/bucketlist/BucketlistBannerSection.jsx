import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styled from 'styled-components'
import bannerImg from '../../assets/banner.png'

const BucketlistBannerSection = () => {
  return (
    <Wrapper>
        <BannerText>
            나의 버킷리스트
        </BannerText>
    </Wrapper>
  )
}

export default BucketlistBannerSection

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