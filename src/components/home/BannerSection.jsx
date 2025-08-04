import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styled from 'styled-components'

const BannerSection = () => {
  return (
    <Wrapper>
        <ArrowButton><FaChevronLeft /></ArrowButton>
        <BannerText>
            <strong>메인 배너에 이벤트 홍보</strong>
            <p>예)” 7.31~8.05일까지 ㅇㅇ백화점 B1 팝업스토어 오픈!” + 사진 뒷배경.</p>
        </BannerText>
        <ArrowButton><FaChevronRight /></ArrowButton>
    </Wrapper>
  )
}

export default BannerSection

const Wrapper = styled.section`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4rem 1rem;
    background-color: #f8f8f8;
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

  strong {
    display: block;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.3rem 0;
    color: #555;
  }
`;