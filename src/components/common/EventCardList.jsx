import React from 'react'
import EventCard from './EventCard'
import styled from 'styled-components'

const EventCardList = ({ events }) => {
  const allItems = events.flatMap(category => [
    ...category.events.map(event => ({
      ...event,
      category: category.category,
      type: "event"
    })),
    ...category.stores.map(store => ({
      ...store,
      category: category.category,
      type: "store"
    }))
  ]);

  allItems.sort((a, b) => b.likeCount - a.likeCount);

  return (
    <ListContainer>
      {allItems.map((event, index) => (
        <EventCard key={index} event={event} />
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