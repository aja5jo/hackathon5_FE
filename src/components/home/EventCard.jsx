import React, { useState } from 'react'
import styled from 'styled-components'

const EventCard = ({event}) => {
    const [like,setLike]=useState(false);
    const toggleLike = () => setLike(!like);

    return (
        <Card>
            {/* <Image>
                <LikeButton onClick = {toggleLike}>
                        {like ? ; }
                         </LikeButton>
            </Image> */}
            <Image/>

            <Label>{event.label}</Label>
            <Title>{event.title}</Title>
            {event.text && <Text>{event.text}</Text>}
            <Period>{event.period}</Period>
        </Card>
    )
}

export default EventCard

const Card =styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background-color: white;
`;

const Image =styled.div`
    background-color: #ccc;
    height: 120px;
    border-radius: 4px;
`;
const Label = styled.div`
    display: inline-block;
    font-size: 0.75rem;
    color: #333;
    background-color: #f0f0f0;
    border-radius: 12px;
    padding: 0.2rem 0.6rem;
`;

const Title = styled.div`
    font-weight: bold;
    margin-top: 0.3rem;
`;

const Period = styled.div`
    font-size: 0.75rem;
    color: #999;
    margin-top: 0.3rem;
`;

const Text = styled.div`
    margin-top: 0.3rem;
`;