import React from 'react'
import EventCard from '../../components/common/EventCard'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const EventCardListCategory = ({ events }) => {
  const navigate = useNavigate();
  const groupedItems = events.reduce((acc, category) => {
    if (!Array.isArray(category?.items)) return acc;

    const items = [...category.items]
      .map((item) => ({
        ...item,
        category: category.category,
      }))
      .sort((a, b) => (b?.likeCount ?? 0) - (a?.likeCount ?? 0));

    if (items.length > 0) {
      acc.push({ category: category.category, items });
    }

    return acc;
  }, []);



  return (
    <Wrapper>
      {groupedItems.map((group, idx) => (
        <CategoryBlock key={idx}>
          <SectionHeader>
            <Subtitle>{group.category}</Subtitle>
            <MoreButton onClick={() => navigate(`/categories/${encodeURIComponent(group.category)}`)}>자세히 보기&nbsp;&gt;</MoreButton>
          </SectionHeader>
          <ListContainer>
          {group.items.map((item, i) => (
              <EventCard key={`${group.category}-${item?.type || 'ITEM'}-${item?.id ?? i}`} event={item} />))}
          </ListContainer>
        </CategoryBlock>
      ))}
    </Wrapper>
  )
}

export default EventCardListCategory

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

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 260px);
  gap: 24px;
  justify-content: center;  
  margin-top: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
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
const MoreButton = styled.button`
  background: none;
  border: none;
  color: #222222;
  font-size: 14px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #FEE502;
  }
`;
