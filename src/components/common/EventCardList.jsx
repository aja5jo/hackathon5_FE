import React from 'react'
import EventCard from './EventCard'
import styled from 'styled-components'



const EventCardList = ({ events = [], includeTypes = ['EVENT', 'POPUP', 'STORE'] }) => {
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

  return (
    <ListContainer>
      {allItems.map((item, index) => (
        <EventCard key={`${item?.type}-${item?.id ?? index}`} event={item} />
      ))}
    </ListContainer>
  )
}

export default EventCardList

const ListContainer = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  justify-content: center;
  margin-top: 2rem;
`;