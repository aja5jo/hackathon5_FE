import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import SearchBox from '../components/home/SearchBox'
import Footer from '../components/common/Footer';
import EventCardList from '../components/common/EventCardList';
import dummyEvents from '../assets/dummy.json'
import HomeBannerSection from '../components/home/HomeBannerSection';
import { useNavigate } from 'react-router-dom';

import { debounce } from '../utils/performance';


const Home = React.memo(() => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // const [homeData, setHomeData] = useState(null); // 백엔드 배포 시 사용

  // 더미 검색 데이터 - useMemo로 최적화
  const searchableData = useMemo(() => {
    const loadSearchableDataFromAPI = async () => {
      try {
        // ===== 백엔드 API 버전 (활성화) =====
        const response = await fetch(`http://3.36.91.28:8080/api/stores`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const result = await response.json();
        
        if (result.success && result.data) {
          const data = result.data.map(item => ({
            ...item,
            category: item.category || 'STORE',
            type: item.type || 'STORE',
            description: item.description || item.desc || '홍대의 인기 가게입니다',
            image: item.thumbnail,
            searchText: `${item.name} ${item.description || ''} ${item.category || 'STORE'} ${item.type || 'STORE'}`.toLowerCase()
          }));
          console.log('API에서 검색 가능한 데이터 구성 완료:', data.length);
          return data;
        }
        
        // ===== 더미데이터 버전 (주석처리) =====
        /*
        const data = [];
        dummyEvents.categories.forEach(categoryData => {
          // items 배열에서 모든 항목 추가
          if (categoryData.items) {
            categoryData.items.forEach(item => {
              data.push({
                ...item,
                category: categoryData.category,
                type: item.type || 'STORE',
                description: item.description || item.desc || '홍대의 인기 가게입니다',
                image: item.thumbnail,
                // 검색을 위한 추가 필드
                searchText: `${item.name} ${item.description || ''} ${categoryData.category} ${item.type || 'STORE'}`.toLowerCase()
              });
            });
          }
        });
        console.log('검색 가능한 데이터 구성 완료:', data.length);
        return data;
        */
        
      } catch (error) {
        console.error('API 데이터 로드 실패:', error);
        // 에러 시 더미 데이터 반환
        const data = [];
        dummyEvents.categories.forEach(categoryData => {
          // items 배열에서 모든 항목 추가
          if (categoryData.items) {
            categoryData.items.forEach(item => {
              data.push({
                ...item,
                category: categoryData.category,
                type: item.type || 'STORE',
                description: item.description || item.desc || '홍대의 인기 가게입니다',
                image: item.thumbnail,
                // 검색을 위한 추가 필드
                searchText: `${item.name} ${item.description || ''} ${categoryData.category} ${item.type || 'STORE'}`.toLowerCase()
              });
            });
          }
        });
        console.log('더미 데이터로 검색 가능한 데이터 구성 완료:', data.length);
        return data;
      }
    };
    
    return loadSearchableDataFromAPI();
    
  }, []);


  

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
        // ===== 백엔드 API 버전 (활성화) =====
        const response = await fetch(`http://3.36.91.28:8080/api/search?q=${encodeURIComponent(term)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const result = await response.json();
        
        if (result.success) {
          setSearchResults(result.data || []);
        } else {
          console.error('검색 실패:', result.message);
          setSearchResults([]);
        }
        
        // ===== 더미데이터 버전 (주석처리) =====
        /*
        // 검색 로직 - 더 정확한 검색을 위해 개선
        const searchLower = term.toLowerCase();
        const results = searchableData.filter(item => {
          // 이름으로 검색
          if (item.name.toLowerCase().includes(searchLower)) return true;
          
          // 설명으로 검색
          if (item.description && item.description.toLowerCase().includes(searchLower)) return true;
          
          // 카테고리로 검색
          if (item.category.toLowerCase().includes(searchLower)) return true;
          
          // 타입으로 검색
          if (item.type && item.type.toLowerCase().includes(searchLower)) return true;
          
          // 통합 검색 텍스트로 검색
          if (item.searchText && item.searchText.includes(searchLower)) return true;
          
          return false;
        });
        
        console.log('검색어:', term);
        console.log('검색 결과:', results);
        console.log('전체 데이터 개수:', searchableData.length);
        
        setSearchResults(results);
        */
        
      } catch (error) {
        console.error('검색 실패:', error);
        // 에러 시 더미 데이터로 검색
        const searchLower = term.toLowerCase();
        const results = searchableData.filter(item => {
          // 이름으로 검색
          if (item.name.toLowerCase().includes(searchLower)) return true;
          
          // 설명으로 검색
          if (item.description && item.description.toLowerCase().includes(searchLower)) return true;
          
          // 카테고리로 검색
          if (item.category.toLowerCase().includes(searchLower)) return true;
          
          // 타입으로 검색
          if (item.type && item.type.toLowerCase().includes(searchLower)) return true;
          
          // 통합 검색 텍스트로 검색
          if (item.searchText && item.searchText.includes(searchLower)) return true;
          
          return false;
        });
        
        console.log('더미 데이터로 검색 결과:', results);
        setSearchResults(results);
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
        // ===== 백엔드 API 버전 (활성화) =====
        const response = await fetch(`http://localhost:8080/api/home/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('데이터 업데이트 성공:', result.message);
          // 성공 시 데이터 다시 로드
          window.location.reload();
        } else {
          alert(result.message || '데이터 업데이트에 실패했습니다.');
        }
        
        // ===== 더미데이터 버전 (주석처리) =====
        /*
        // 페이지 새로고침으로 더미 데이터 리셋
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        */
        
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
          <EventCardList events={dummyEvents.categories} maxItems={6}/>
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

const Header = styled.div`
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

