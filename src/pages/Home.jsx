import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import SearchBox from '../components/home/SearchBox'
import Footer from '../components/common/Footer';
import EventCardList from '../components/common/EventCardList';
import dummyEvents from '../assets/dummy.json'
import HomeBannerSection from '../components/home/HomeBannerSection';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 더미 검색 데이터
  const searchableData = [];
  
  // 더미 데이터에서 검색 가능한 데이터 구성
  dummyEvents.categories.forEach(categoryData => {
    // 가게 데이터 추가
    if (categoryData.stores) {
      categoryData.stores.forEach(store => {
        searchableData.push({
          ...store,
          category: categoryData.category,
          type: 'store',
          description: store.desc || '홍대의 인기 가게입니다',
          image: store.thumbnail
        });
      });
    }
    
    // 이벤트 데이터 추가
    if (categoryData.events) {
      categoryData.events.forEach(event => {
        searchableData.push({
          ...event,
          category: categoryData.category,
          type: 'event',
          description: event.desc || '특별한 이벤트입니다',
          image: event.thumbnail
        });
      });
    }
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsSearching(true);
    
    // 검색 로직
    const results = searchableData.filter(item => 
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.category.toLowerCase().includes(term.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(term.toLowerCase()))
    );
    
    setSearchResults(results);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleItemClick = (item) => {
    const category = item.category.toLowerCase();
    navigate(`/lookmore/${category}/${item.type}/${item.id}`);
  };

  return (
    <Container>
      <HomeBannerSection />
      {/* 검색 기능 */}
      <SearchBox onSearch={handleSearch} />

      {isSearching ? (
        // 검색 결과 표시
        <SearchResultsSection>
          <SearchHeader>
            <SearchTitle>
              <SearchQuery>'{searchTerm}'</SearchQuery> 검색 결과
              <SearchCount>({searchResults.length}개)</SearchCount>
            </SearchTitle>
            <ClearButton onClick={handleClearSearch}>✕ 검색 취소</ClearButton>
          </SearchHeader>
          
          {searchResults.length > 0 ? (
            <SearchResultsGrid>
              {searchResults.map((item) => (
                <SearchResultCard key={`${item.category}-${item.id}`} onClick={() => handleItemClick(item)}>
                  <ResultImage>
                    <img src={item.image} alt={item.name} />
                    <CategoryBadge>{item.category}</CategoryBadge>
                  </ResultImage>
                  <ResultContent>
                    <ResultTitle>{item.name}</ResultTitle>
                    <ResultDescription>{item.description}</ResultDescription>
                  </ResultContent>
                </SearchResultCard>
              ))}
            </SearchResultsGrid>
          ) : (
            <EmptyResults>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>검색 결과가 없습니다</EmptyTitle>
              <EmptyDescription>다른 키워드로 검색해보세요</EmptyDescription>
            </EmptyResults>
          )}
        </SearchResultsSection>
      ) : (
        // 기본 홈 화면
        <>
          <SectionHeader>
            <Title>
              <Subtitle>꼬꼬리스트</Subtitle>
              <Maintitle>나의 취향맞춤 가게 이벤트</Maintitle>
            </Title>
            <MoreButton onClick={() => navigate('/morelistmain')}>자세히 보기&nbsp;&gt;</MoreButton>
          </SectionHeader>
          <EventCardList events={dummyEvents.categories}/>
        </>
      )}
      
      <Footer/>
    </Container>
  )
}

export default Home

const Container = styled.main`
  padding: 2rem;
`;
const SectionHeader = styled.div`
  display: flex;
  margin-top: 2rem;
  padding: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const Subtitle = styled.div`
  color: #262626;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
`;
const Maintitle = styled.div`
  color: #262626;
  font-size: 26px;
  font-style: normal;
  font-weight: 600;
  line-height: 32.5px;
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
`;
const MoreButton = styled.button`
  background: none;
  border: none;
  color: #222222;
  font-size: 14px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #FEE502;
  }
`;

const SearchResultsSection = styled.section`
  margin: 2rem 0;
  padding: 0 1rem;
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const SearchTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #262626;
  margin: 0;
`;

const SearchQuery = styled.span`
  color: #FEE502;
  font-weight: 700;
`;

const SearchCount = styled.span`
  color: #666;
  font-size: 1.4rem;
  font-weight: 400;
  margin-left: 0.5rem;
`;

const ClearButton = styled.button`
  background-color: #FEE502;
  color: #262626;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #E6CF00;
  }
`;

const SearchResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const SearchResultCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const ResultImage = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 0.4rem 0.8rem;
  background-color: #FEE502;
  color: #262626;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ResultContent = styled.div`
  padding: 1.5rem;
`;

const ResultTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: #262626;
  margin: 0 0 0.8rem 0;
`;

const ResultDescription = styled.p`
  font-size: 1.3rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
`;

const EmptyResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  color: #666;
  margin: 0 0 1rem 0;
`;

const EmptyDescription = styled.p`
  font-size: 1.4rem;
  color: #888;
  margin: 0;
`;

