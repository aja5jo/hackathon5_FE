import React, { useState } from 'react'
import styled from 'styled-components'
import offlike from '../../assets/offlike.svg'
import onlike from '../../assets/onlike.svg'
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [like, setLike] = useState(event.liked);
  const [likeCount, setLikeCount] = useState(event.likeCount);

  const toggleLike = () => {
    if (like) {
      setLike(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLike(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const getDetailPath = () => {
    const t = (event.type || '').toString().toLowerCase();
    if (t === 'store') return `/store/${event.id}`;
    if (t === 'popup') return `/popup/${event.id}`;
    if (t === 'event') return `/event/${event.id}`;
    return `/event/${event.id}`; // fallback
  };

  return (
    <Card onClick={() => navigate(getDetailPath())}>
      <Image>
        <LikeContainer>
          <LikeButton onClick={toggleLike}>
            <img src={like ? onlike : offlike} alt="좋아요" />
          </LikeButton>
          <LikeCount>{likeCount}</LikeCount>
        </LikeContainer>
      </Image>

      <TextContainer>
        <TagContainer>
          {event.category && <Tag>{event.category}</Tag>}
          {event.type?.toUpperCase() === "EVENT" && <EventTag>EVENT</EventTag>}
          {event.type?.toUpperCase() === "POPUP" && <PopupTag>POPUP</PopupTag>}
          {event.type?.toUpperCase() === "STORE" && <StoreTag>STORE</StoreTag>}
        </TagContainer>
        <Title>{event.name}</Title>

        
        {(event.description ?? event.desc) && <Text>{event.description ?? event.desc}</Text>}
        <PeriodLine>
          {['EVENT', 'POPUP'].includes(event.type?.toUpperCase()) && (event.startDate || event.endDate)
            ? event.startDate && event.endDate
              ? `${event.startDate} ~ ${event.endDate}`
              : `${event.startDate || event.endDate}`
            : ''}
        </PeriodLine>
      </TextContainer>
    </Card>
  );
};

export default EventCard;

// 높이 360, 폭 260 고정값
const Card = styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    height: 360px; 
    overflow: hidden; 
    flex: none;
    width: 260px;
`;

const LikeButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    img {
        width: 32px;
        height: 32px;
    }
`;
const LikeCount = styled.div`
    font-size: 12px;
    color: gray;
    margin-top: 4px;
`;
const LikeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 10.5px;
    right: 10.5px;
`;

const Image = styled.div`
  background-color: #ccc;
  aspect-ratio: 4 / 3;
  border-radius: 4px;
  display: flex;
  justify-content: flex-end;
  padding: 10.5px;
  position: relative;
`;

const TextContainer=styled.section`
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding-top: 16px;
    flex: 1;       
    min-height: 0;  
`;
const TagContainer = styled.section`
    display: flex;
    gap: 4px;
`;
const Tag = styled.div`
    display: inline-block;
    font-size: 1rem;
    color: #333;
    background: #FEE502;
    border-radius: 4px;
    padding: 0.2rem 0.6rem;
    line-height: 1;
    align-self: flex-start;
`;
const EventTag = styled.div`
    display: inline-block;
    font-size: 1rem;
    color: #333;
    background: #f98825;
    border-radius: 4px;
    padding: 0.2rem 0.6rem;
    line-height: 1;
    align-self: flex-start;
`;

const PopupTag = styled.div`
  display: inline-block;
  font-size: 1rem;
  color: #333;
  background: #25a8f9;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  line-height: 1;
  align-self: flex-start;
`;
const StoreTag = styled.div`
  display: inline-block;
  font-size: 1rem;
  color: #333;
  background: #25f97f;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  line-height: 1;
  align-self: flex-start;
`;

const Title = styled.div`
    margin-top: 0.3rem;
    color: #222;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 600;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 제목 2줄 제한 */
    overflow: hidden;
`;

const Period = styled.div`
    font-size: 0.75rem;
    color: #A3A3A3;
    margin-top: 0.3rem;
    font-weight: 400;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Text = styled.div`
    margin-top: 0.3rem;
    font-size: 1.2rem;
    color: #222222;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;   
    overflow: hidden;
    min-height: 0;
`;

const PeriodLine = styled(Period)`
  height: calc(0.75rem * 1.4); /* Period의 폰트/라인에 맞춰 한 줄 높이 고정 */
`;