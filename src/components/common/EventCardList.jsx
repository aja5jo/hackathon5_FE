import React from 'react'
import EventCard from './EventCard'
import styled from 'styled-components'

const EventCardList = ({ events = [], includeTypes = ['EVENT', 'POPUP', 'STORE'], maxItems }) => {
  console.log('EventCardList 받은 events:', events);
  
  const allItems = events
    .flatMap((category) => {
      console.log('카테고리 처리:', category);
      if (!Array.isArray(category?.items)) {
        console.log('카테고리 items가 배열이 아님:', category?.items);
        return [];
      }
      // ✅ 서버 원본값 보존: category 덮어쓰기 제거
      return category.items;
    })
    .filter((item) => {
      const isIncluded = includeTypes.includes(item?.type);
      console.log('아이템 필터링:', item?.name, item?.type, isIncluded);
      return isIncluded;
    })
    // .sort((a, b) => (b?.likeCount ?? 0) - (a?.likeCount ?? 0));

  console.log('EventCardList allItems:', allItems);
  const visibleItems = typeof maxItems === 'number' ? allItems.slice(0, maxItems) : allItems;
  console.log('EventCardList visibleItems:', visibleItems);

  // ✅ 좋아요 변경 핸들러
  const handleLikeChange = (itemId, newLiked) => {
    console.log('EventCardList - 좋아요 변경 감지:', { itemId, newLiked });
    // 좋아요 변경 이벤트 발생
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  return (
    <ListContainer>
      {console.log('EventCardList 렌더링 시작, visibleItems 개수:', visibleItems.length)}
      {visibleItems.length === 0 ? (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
          표시할 항목이 없습니다.
        </div>
      ) : (
        visibleItems.map((item, index) => {
          console.log('EventCard 렌더링 시도:', index, item);
          return (
            <EventCard 
              key={`${item?.type}-${item?.id ?? index}`} 
              event={item} 
              onRemove={handleLikeChange}
            />
          );
        })
      )}
    </ListContainer>
  )
}

export default EventCardList

const ListContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;