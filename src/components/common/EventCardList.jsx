import React from 'react'
import EventCard from './EventCard'
import styled from 'styled-components'



const EventCardList = ({ events = [], includeTypes = ['EVENT', 'POPUP', 'STORE'], maxItems }) => {
  const allItems = events
    .flatMap((category) => {
      if (!Array.isArray(category?.items)) return [];
      return category.items.map((item) => ({
        ...item,
        category: category.category,
      }));
    })
    .filter((item) => includeTypes.includes(item?.type))
    .sort((a, b) => (b?.likeCount ?? 0) - (a?.likeCount ?? 0));

  const visibleItems = typeof maxItems === 'number' ? allItems.slice(0, maxItems) : allItems;

  return (
    <ListContainer>
      {visibleItems.map((item, index) => (
        <EventCard key={`${item?.type}-${item?.id ?? index}`} event={item} />
      ))}
    </ListContainer>
  )
}

export default EventCardList

const ListContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
`;