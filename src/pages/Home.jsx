import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import SearchBox from '../components/home/SearchBox'
import Footer from '../components/common/Footer';
import EventCardList from '../components/common/EventCardList';
import HomeBannerSection from '../components/home/HomeBannerSection';
import { useNavigate } from 'react-router-dom';
import { storesAPI, mainAPI } from '../services/api';

import { debounce } from '../utils/performance';


const Home = React.memo(() => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // const [homeData, setHomeData] = useState(null); // 백엔드 배포 시 사용

  // 검색 데이터 구성 함수 - 중복 제거를 위해 분리
  const buildSearchableData = useCallback((rawData) => {
    if (!rawData) return [];
    
    return rawData.map(item => ({
      ...item,
      category: item.category || 'STORE',
      type: item.type || 'STORE',
      description: item.description || item.desc || '홍대의 인기 가게입니다',
      image: item.thumbnail,
      searchText: `${item.name} ${item.description || ''} ${item.category || 'STORE'} ${item.type || 'STORE'}`.toLowerCase()
    }));
  }, []);

  // 검색 데이터 상태
  const [searchableData, setSearchableData] = useState([]);

  // 검색 데이터 로드
  useEffect(() => {
    const loadSearchableDataFromAPI = async () => {
      try {
        const result = await storesAPI.getStores();
        
        if (result.success && result.data) {
          const data = buildSearchableData(result.data);
          console.log('API에서 검색 가능한 데이터 구성 완료:', data.length);
          setSearchableData(data);
        } else {
          console.log('API 응답이 성공이 아니거나 데이터가 없음, 빈 배열로 설정');
          setSearchableData([]);
        }
        
      } catch (error) {
        console.error('API 데이터 로드 실패:', error);
        
        // 500 에러인 경우 사용자에게 알림
        if (error.message && error.message.includes('500')) {
          console.log('서버 오류 발생, 빈 배열로 설정하고 계속 진행');
        }
        
        setSearchableData([]);
      }
    };
    
    loadSearchableDataFromAPI();
    
  }, [buildSearchableData]);


  

  const handleSearch = useCallback((term) => {
    console.log('handleSearch 호출됨:', term);
    
    if (!term.trim()) {
      setSearchTerm('');
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setSearchTerm(term);
    setIsSearching(true);
    
    const performSearch = async () => {
      try {
        const result = await mainAPI.search(term);
        
        if (result.success) {
          setSearchResults(result.data || []);
        } else {
          console.error('검색 실패:', result.message);
          setSearchResults([]);
        }
        
      } catch (error) {
        console.error('검색 실패:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    performSearch();
    
  }, [searchableData]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  const handleItemClick = useCallback((item) => {
    const category = item.category.toLowerCase();
    navigate(`/lookmore/${category}/${item.type}/${item.id}`);
  }, [navigate]);

  const handleUpdateClick = useCallback(() => {
    setIsUpdating(true);
    
    const updateData = async () => {
      try {
        const result = await mainAPI.updateHome();
        
        if (result.success) {
          console.log('데이터 업데이트 성공:', result.message);
          // 성공 시 데이터 다시 로드
          window.location.reload();
        } else {
          alert(result.message || '데이터 업데이트에 실패했습니다.');
        }
        
      } catch (error) {
        console.error('데이터 업데이트 실패:', error);
        alert('데이터 업데이트에 실패했습니다.');
      } finally {
        setIsUpdating(false);
      }
    };

    updateData();
  }, []);

  return (
    <Container>
      {/* 메인 배너 섹션 */}
      <HomeBannerSection />

      {/* 검색 및 필터 섹션 */}
      <SearchSection>
        <SearchBox onSearch={handleSearch} />
      </SearchSection>

             {searchTerm ? (
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
                     <img src={item.image || item.thumbnail} alt={item.name} onError={(e) => {
                       e.target.src = 'https://picsum.photos/300/200?random=' + item.id;
                     }} />
                     <CategoryBadge>{item.category}</CategoryBadge>
                     <TypeBadge>{item.type}</TypeBadge>
                   </ResultImage>
                   <ResultContent>
                     <ResultTitle>{item.name}</ResultTitle>
                     <ResultDescription>{item.description || '홍대의 인기 가게입니다'}</ResultDescription>
                     <ResultInfo>
                       <InfoItem>📍 홍대</InfoItem>
                       {item.startDate && <InfoItem>📅 {item.startDate}</InfoItem>}
                       <InfoItem>❤️ {item.likeCount || 0}</InfoItem>
                     </ResultInfo>
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
        // 기본 홈 화면 - 카드 그리드
        <MainContent>
          {/* 상단 헤더 */}
          <TopHeader>
            <BrandName>홍대 해커톤</BrandName>
            <UpdateButton onClick={handleUpdateClick} disabled={isUpdating}>
              <UpdateIcon className={isUpdating ? 'spinning' : ''}>🔄</UpdateIcon>
              {isUpdating ? '업데이트 중...' : '업데이트'}
            </UpdateButton>
          </TopHeader>

          {/* 메인 제목 */}
          <SectionHeader>
            <SectionTitle>추천 카테고리:</SectionTitle>
            <MoreButton onClick={() => navigate('/morelistmain')}>더보기</MoreButton>
          </SectionHeader>

                     {/* 카드 그리드 */}
           <EventCardList events={[]} maxItems={6}/>
        </MainContent>
      )}
      
      <Footer/>
    </Container>
  )
});

// 스타일 컴포넌트들
const Container = styled.div`
  background-color: #f8f9fa;
  width: 100%;
`;

const HeaderWrapper = styled.div`
  height: 64px;
  background-color: white;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const SearchSection = styled.div`
  padding: 0 2rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const MainContent = styled.div`
  padding: 0 2rem 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BrandName = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  color: #262626;
  margin: 0;
`;

const UpdateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #E6CF00;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    color: #888;
    transform: none;
  }
`;

const UpdateIcon = styled.span`
  font-size: 1.2rem;
  
  &.spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: #262626;
  margin: 0;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 1.6rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
`;

const SearchResultsSection = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SearchTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: #262626;
  margin: 0;
`;

const SearchQuery = styled.span`
  color: #007bff;
  font-weight: 700;
`;

const SearchCount = styled.span`
  color: #666;
  font-weight: 400;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const SearchResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const SearchResultCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ResultImage = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #FEE502;
  color: #262626;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const TypeBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ResultContent = styled.div`
  padding: 1.5rem;
`;

const ResultTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #262626;
  margin: 0 0 0.5rem 0;
`;

const ResultDescription = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.4;
`;

const ResultInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const InfoItem = styled.span`
  font-size: 1.2rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const EmptyResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  color: #666;
  margin: 0 0 0.5rem 0;
`;

const EmptyDescription = styled.p`
  font-size: 1.4rem;
  color: #888;
  margin: 0;
`;

export default Home;

