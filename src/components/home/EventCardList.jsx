import React from 'react'
import EventCard from './EventCard'
import styled from 'styled-components'

const EventCardList = ({events}) => {
  return (
    <ListContainer>
        {events.map((event,index)=>(
            <EventCard key={index} event={event}/>
        ))}
    </ListContainer>
  )
}

export default EventCardList

const ListContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    margin-top: 2rem;
`