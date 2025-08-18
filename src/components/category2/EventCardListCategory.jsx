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
          {group.items.slice(0, 3).map((item, i) => (
              <EventCard key={`${group.category}-${item?.type || 'ITEM'}-${item?.id ?? i}`} event={item} excludeStatuses={["진행중","예정"]} />))}
          </ListContainer>
        </CategoryBlock>
      ))}
    </Wrapper>
  )
}

export default EventCardListCategory

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-top: 2rem;
`;

const CategoryBlock = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionHeader = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem; /* keep in sync with ListContainer */
  display: flex;
  align-items: center;
  justify-content: center; /* centers the title */
`;

const ListContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
`;

const Subtitle = styled.div`
  text-align: center;
  color: #262626;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 auto; /* keeps title centered in flex */
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #222222;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease, color 0.2s ease;
  position: absolute;
  right: 2rem; /* match SectionHeader horizontal padding */

  &:hover {
    color: #FEE502;
    transform: translateY(-1px);
  }
`;
