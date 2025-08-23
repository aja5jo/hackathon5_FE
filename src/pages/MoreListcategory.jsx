// /src/pages/moreListcategory.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import SearchBox from '../components/home/SearchBox';
import Footer from '../components/common/Footer';
import EventCard from '../components/common/EventCard';

import dummyEvents from '../assets/dummy.json';

function MoreListcategory() {
  const { category } = useParams(); 
  const [groupedItems, setGroupedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setLoading(true);
        
        // ===== 백엔드 API 버전 (활성화) =====
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories/${category}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const result = await response.json();
        
        if (result.success && result.data) {
          const categoryData = result.data;
          
          const items = categoryData.items || [];
          const sortedItems = items
            .map((item) => ({
              ...item,
              category: categoryData.category,
            }))
            .sort((a, b) => (b?.likeCount ?? 0) - (a?.likeCount ?? 0));

          if (sortedItems.length > 0) {
            setGroupedItems([{ category: categoryData.category, items: sortedItems }]);
          } else {
            setGroupedItems([]);
          }
        } else {
          setError(result.message || '카테고리 데이터를 불러올 수 없습니다.');
          setGroupedItems([]);
        }
        
        // ===== 더미데이터 버전 (주석처리) =====
        /*
        const filtered = (dummyEvents?.categories || []).filter(
          (c) => String(c.category).toLowerCase() === String(category).toLowerCase()
        );

        const grouped = filtered.reduce((acc, cat) => {
          if (!Array.isArray(cat?.items)) return acc;

          const items = [...cat.items]
            .map((item) => ({
              ...item,
              category: cat.category,
            }))
            .sort((a, b) => (b?.likeCount ?? 0) - (a?.likeCount ?? 0));

          if (items.length > 0) acc.push({ category: cat.category, items });
          return acc;
        }, []);
        
        setGroupedItems(grouped);
        */
        
      } catch (error) {
        console.error('카테고리 데이터 로드 실패:', error);
        setError('서버 연결에 실패했습니다.');
        setGroupedItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [category]);

  const title = groupedItems[0]?.category || category || '카테고리';

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingText>카테고리 데이터를 불러오는 중...</LoadingText>
        </LoadingContainer>
        <Footer />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <SectionHeader>
        <Maintitle>{title}</Maintitle>
      </SectionHeader>

      {groupedItems.length === 0 ? (
        <Info>해당 카테고리에 대한 데이터가 없습니다.</Info>
      ) : (
        <Wrapper>
          {groupedItems.map((group, idx) => (
            <CategoryBlock key={idx}>
              <ListContainer>
                {group.items.map((item, i) => (
                  <EventCard key={`${group.category}-${item.id}-${i}`} event={item} />
                ))}
              </ListContainer>
            </CategoryBlock>
          ))}
        </Wrapper>
      )}

      <Footer />
    </Container>
  );
}

export default MoreListcategory;

const Container = styled.main`
  padding: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  margin-top: 2rem;
  padding: 1rem;
  gap: 1rem;
  justify-content: center;
`;


const Maintitle = styled.div`
  color: #262626;
  font-size: 26px;
  font-weight: 600;
  line-height: 32.5px;
`;


const Info = styled.div`
  text-align: center;
  color: #888;
  margin: 2rem 0;
  font-size: 18px;
`;

// 아래부터 카테고리별 리스트 뷰
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-top: 2rem;
`;

const CategoryBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem 0;
`;

const RowTitle = styled.div`
  color: #262626;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const LoadingText = styled.div`
  font-size: 1.8rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const ErrorText = styled.div`
  font-size: 1.8rem;
  color: #FF6B35;
`;