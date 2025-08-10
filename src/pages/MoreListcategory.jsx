// /src/pages/moreListcategory.jsx
import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import SearchBox from '../components/home/SearchBox';
import Footer from '../components/common/Footer';
import EventCard from '../components/common/EventCard';

import dummyEvents from '../assets/dummy.json';

function MoreListcategory() {
  const { category } = useParams(); 

  // URL 파라미터와 동일한 카테고리만 필터 (대소문자 무시)
  const filtered = (dummyEvents?.categories || []).filter(
    (c) => String(c.category).toLowerCase() === String(category).toLowerCase()
  );

  // EventCardListCategory의 로직을 그대로 이 페이지에서 수행 (버튼 제거)
  const groupedItems = filtered.reduce((acc, cat) => {
    const items = [
      ...(cat.events || []).map((event) => ({
        ...event,
        category: cat.category,
        type: 'event',
      })),
      ...(cat.stores || []).map((store) => ({
        ...store,
        category: cat.category,
        type: 'store',
      })),
    ];

    items.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));

    if (items.length > 0) acc.push({ category: cat.category, items });
    return acc;
  }, []);

  const title = groupedItems[0]?.category || category || '카테고리';

  return (
    <Container>
      <SearchBox />

      <SectionHeader>
        <TitleWrap>
          <Maintitle>{title}</Maintitle>
          <Subtitle>해당 카테고리의 전체 목록</Subtitle>
        </TitleWrap>
      </SectionHeader>

      {groupedItems.length === 0 ? (
        <Info>해당 카테고리에 대한 데이터가 없습니다.</Info>
      ) : (
        <Wrapper>
          {groupedItems.map((group, idx) => (
            <CategoryBlock key={idx}>
              <HeaderRow>
                <RowTitle>{group.category}</RowTitle>
                {/* 더보기 버튼 제거됨 */}
              </HeaderRow>
              <ListContainer>
                {group.items.map((item, i) => (
                  <EventCard key={`${group.category}-${item.id}-${i}`} event={item} />
                ))}
              </ListContainer>
            </CategoryBlock>
          ))}
        </Wrapper>
      )}

      <Footer />
    </Container>
  );
}

export default MoreListcategory;

const Container = styled.main`
  padding: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  margin-top: 2rem;
  padding: 1rem;
  gap: 1rem;
  justify-content: space-between;
  align-items: flex-end;
`;

const Subtitle = styled.div`
  color: #262626;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;

const Maintitle = styled.div`
  color: #262626;
  font-size: 26px;
  font-weight: 600;
  line-height: 32.5px;
`;

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Info = styled.div`
  text-align: center;
  color: #888;
  margin: 2rem 0;
  font-size: 18px;
`;

// 아래부터 카테고리별 리스트 뷰
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-top: 2rem;
`;

const CategoryBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem 0;
`;

const RowTitle = styled.div`
  color: #262626;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 260px);
  gap: 24px;
  justify-content: center;
  margin-top: 2rem;
`;