import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import offlike from '../../assets/offlike.svg'
import onlike from '../../assets/onlike.svg'

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [like, setLike] = useState(event.liked);
  const [likeCount, setLikeCount] = useState(event.likeCount);

  const toggleLike = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    if (like) {
      setLike(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLike(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handleCardClick = () => {
    // 카테고리와 아이템 정보를 URL 파라미터로 전달
    navigate(`/lookmore/${event.category}/${event.type}/${event.id}`);
  };

  return (
    <Card onClick={handleCardClick}>
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
            {event.type === "event" && <EventTag>EVENT</EventTag>}
        </TagContainer>
        <Title>{event.name}</Title>

        {/* desc도 이벤트항목에 있는건가?? -> 찾아보기 */}
        {event.desc && <Text>{event.desc}</Text>}
        <PeriodLine>
          {event.type === "event" && event.startDate && event.endDate
            ? `${event.startDate} ~ ${event.endDate}`
            : ""}
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
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
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
    flex: 1;        /* 이미지 아래 영역이 카드 높이에 맞춰 유연하게 차도록 */
    min-height: 0;  /* -webkit-line-clamp가 flex 컨테이너에서 제대로 동작하도록 */
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