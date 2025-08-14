import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import BucketlistBannerSection from '../components/bucketlist/BucketlistBannerSection';
import dummy from '../assets/dummy.json';

function BucketList() {
  const [bucketlistItems, setBucketlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      // Flatten various possible shapes in dummy.json into a single array
      const flat = [];
      const root = dummy || {};
      // Case 1: { categories: [...] }
      if (Array.isArray(root.categories)) {
        root.categories.forEach((cat) => {
          if (Array.isArray(cat.items)) {
            flat.push(...cat.items.map((x)=>({ ...x, category: x.category ?? cat.category })));
          }
          if (Array.isArray(cat.events)) {
            flat.push(...cat.events.map((x) => ({ ...x, type: x.type || 'event', category: x.category ?? cat.category })));
          }
          if (Array.isArray(cat.stores)) {
            flat.push(...cat.stores.map((x) => ({ ...x, type: x.type || 'store', category: x.category ?? cat.category })));
          }
          if (Array.isArray(cat.popups)) {
            flat.push(...cat.popups.map((x) => ({ ...x, type: x.type || 'popup', category: x.category ?? cat.category })));
          }
        });
      }
      // Case 2: top-level arrays
      if (Array.isArray(root.items)) flat.push(...root.items);
      if (Array.isArray(root.events)) flat.push(...root.events.map((x) => ({ ...x, type: x.type || 'event' })));
      if (Array.isArray(root.stores)) flat.push(...root.stores.map((x) => ({ ...x, type: x.type || 'store' })));
      if (Array.isArray(root.popups)) flat.push(...root.popups.map((x) => ({ ...x, type: x.type || 'popup' })));
      // Normalize to API spec and filter to favorites only
      const norm = flat
        .map((it) => {
          const t = (it.type || '').toString().toLowerCase();
          const type =
            t === 'store' || t === 'event' || t === 'popup'
              ? t
              : (it.type === 'STORE' ? 'store' : it.type === 'POPUP' ? 'popup' : it.type === 'EVENT' ? 'event' : 'store');
          return {
            id: it.id,
            type,
            liked: Boolean(it.liked),
            likeCount: Number(it.likeCount ?? 0),
            name: it.name || it.title || '',
            category: it.category || '',
          };
        })
        .filter((it) => it.liked && it.id != null);
      setBucketlistItems(norm);
      setError(null);
    } catch (e) {
      setError('dummy.json을 읽어오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Wrapper>
      <BucketlistBannerSection />
      <Layout>
        <LeftPanel>
          <LeftTitle>나의 버킷리스트</LeftTitle>
          {loading && <Message>불러오는 중...</Message>}
          {error && <Message>Error: {error}</Message>}
          {!loading && !error && bucketlistItems.length === 0 && (
            <Message>즐겨찾기한 항목이 없습니다.</Message>
          )}
          {!loading && !error && (
            <ListContainer>
              {bucketlistItems.map(item => (
                <Item key={`${item.type}:${item.id}`}>
                  <Thumb aria-hidden />
                  <ItemBody>
                    <RowTop>
                      <TagContainer>
                        {item.category && <Tag>{item.category}</Tag>}
                        {item.type?.toUpperCase() === 'EVENT' && <EventTag>EVENT</EventTag>}
                        {item.type?.toUpperCase() === 'POPUP' && <PopupTag>POPUP</PopupTag>}
                        {item.type?.toUpperCase() === 'STORE' && <StoreTag>STORE</StoreTag>}
                      </TagContainer>
                      <LikeBox>★ {item.likeCount?.toLocaleString?.() ?? 0}</LikeBox>
                    </RowTop>
                    <Name title={item.name}>{item.name}</Name>
                  </ItemBody>
                </Item>
              ))}
            </ListContainer>
          )}
        </LeftPanel>
        <RightPanel>
          지도 영역
        </RightPanel>
      </Layout>
    </Wrapper>
  )
}

export default BucketList

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 1rem 2rem;
`;

const Layout = styled.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
  min-height: 600px;
`;
const LeftPanel = styled.aside`
  width: 400px;
  max-width: 420px;
  min-width: 360px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const RightPanel = styled.div`
  flex: 1;
  background: #f1f3f5; /* 회색 박스 */
  border: 1px solid #e9ecef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #868e96;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  overflow: auto;
  padding-right: 4px;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 10px;
  background: #fff;
  border: 1px solid #f1f3f5;
  border-radius: 8px;
  padding: 10px;
  align-items: center;
`;
const Thumb = styled.div`
  width: 100%;
  aspect-ratio: 16/10;
  background: #ccc;
  border-radius: 6px;
`;
const ItemBody = styled.div`
  display: grid;
  gap: 6px;
`;
const RowTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Message = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f1f3f5;
  color: #495057;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 6px;
`;
const Name = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111;
  margin-top: 2px;
`;
const LikeBox = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #495057;
`;

const LeftTitle = styled.h2`
  margin: 6px 6px 10px;
  font-size: 16px;
  font-weight: 700;
  color: #212529;
`;
const TagContainer = styled.section`
  display: flex;
  gap: 4px;
`;
const Tag = styled.div`
  display: inline-block;
  font-size: 0.85rem;
  color: #333;
  background: #FEE502;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  line-height: 1;
  align-self: flex-start;
`;
const EventTag = styled.div`
  display: inline-block;
  font-size: 0.85rem;
  color: #333;
  background: #f98825;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  line-height: 1;
  align-self: flex-start;
`;
const PopupTag = styled.div`
  display: inline-block;
  font-size: 0.85rem;
  color: #333;
  background: #25a8f9;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  line-height: 1;
  align-self: flex-start;
`;
const StoreTag = styled.div`
  display: inline-block;
  font-size: 0.85rem;
  color: #333;
  background: #25f97f;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  line-height: 1;
  align-self: flex-start;
`;