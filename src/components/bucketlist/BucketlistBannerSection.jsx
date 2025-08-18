import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styled from 'styled-components'
import bannerImg from '../../assets/banner.png'

const BucketlistBannerSection = () => {
  return (
    <BannerSection>
        <BannerContent>
          <BannerTitle>즐겨찾기</BannerTitle>
          <BannerSubtitle>나만의 특별한 장소들을 모아보세요</BannerSubtitle>
        </BannerContent>
      </BannerSection>
  )
}

export default BucketlistBannerSection

const BannerSection = styled.div`
  width: 100%;
  height: 300px;
  background: 
    linear-gradient(0deg, rgba(102, 92, 14, 0.3) 0%, rgba(102, 92, 14, 0.3) 100%),
    url(${bannerImg});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerContent = styled.div`
  text-align: center;
  color: white;
`;

const BannerTitle = styled.h1`
  font-size: 5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -2px;
`;

const BannerSubtitle = styled.p`
  font-size: 1.8rem;
  font-weight: 400;
  color: white;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;