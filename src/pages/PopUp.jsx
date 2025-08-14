import React from 'react';
import styled from 'styled-components';
import EventCard from '../components/common/EventCard';
import dummy from '../assets/dummy.json';
import PopupBannerSection from '../components/popup/PopupBannerSection';

export default function PopUp() {
  // 카테고리 구분 없이 POPUP만 평탄화하여 단일 리스트로 렌더
  const list = (dummy?.categories || []).flatMap(cat =>
    (cat.items || [])
      .filter(it => String(it?.type).toUpperCase() === 'POPUP')
      .map(it => ({ ...it, category: cat.category }))
  );

  return (
    <Wrapper>
      <PopupBannerSection />
      <ListContainer>
        {list.map((item, i) => (
          <EventCard key={`${item.category}-${item?.id ?? i}`} event={item} />
        ))}
      </ListContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 260px);
  gap: 24px;
  justify-content: center;
`;