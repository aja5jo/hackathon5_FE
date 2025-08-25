import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import SearchBox from '../components/home/SearchBox'
import Footer from '../components/common/Footer';
import EventCardList from '../components/common/EventCardList';
import HomeBannerSection from '../components/home/HomeBannerSection';
import { useNavigate } from 'react-router-dom';
import { storesAPI, mainAPI, isMerchant, isUser } from '../services/api';

import { debounce } from '../utils/performance';


const Home = React.memo(() => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태를 false로 강제 설정
  
  // 강제로 로딩 상태를 false로 유지
  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  // isLoading 상태 변경 추적
  useEffect(() => {
    console.log('isLoading 상태 변경:', isLoading);
  }, [isLoading]);
  // const [homeData, setHomeData] = useState(null); // 백엔드 배포 시 사용

  // 검색 데이터 구성 함수 - 중복 제거를 위해 분리
  const buildSearchableData = useCallback((rawData) => {
    if (!rawData) return [];
    
    // 데이터 변환
    const transformedData = rawData.map(item => ({
      ...item,
      category: item.category || 'STORE',
      type: item.type || 'STORE',
      description: item.description || item.desc || '홍대의 인기 가게입니다',
      image: item.thumbnail,
      searchText: `${item.name} ${item.description || ''} ${item.category || 'STORE'} ${item.type || 'STORE'}`.toLowerCase()
    }));

    // 백엔드에서 이미 정렬된 데이터를 제공하므로 프론트엔드에서 추가 정렬하지 않음
    // API 명세서: "정렬 로직만 서비스에서 분기 처리"
    console.log('백엔드에서 제공된 정렬된 데이터 사용:', transformedData.length, '개');
    return transformedData;
  }, []);

  // 검색 데이터 상태
  const [searchableData, setSearchableData] = useState([]);

  // EventCardList용 데이터 변환 함수
  const transformDataForEventCardList = useCallback((data) => {
    console.log('transformDataForEventCardList 입력 데이터:', data);
    
    if (!Array.isArray(data) || data.length === 0) {
      console.log('데이터가 배열이 아니거나 비어있음');
      return [];
    }
    
    // 카테고리별로 그룹화
    const groupedByCategory = data.reduce((acc, item) => {
      const category = item.category || 'STORE';
      if (!acc[category]) {
        acc[category] = {
          category: category,
          items: []
        };
      }
      acc[category].items.push(item);
      return acc;
    }, {});
    
    const result = Object.values(groupedByCategory);
    console.log('transformDataForEventCardList 결과:', result);
    return result;
  }, []);

  // EventCardList용 변환된 데이터
  const eventCardListData = useMemo(() => {
    return transformDataForEventCardList(searchableData);
  }, [searchableData, transformDataForEventCardList]);

  // 검색 데이터 로드
  useEffect(() => {
    const loadSearchableDataFromAPI = async () => {
      setIsLoading(true); // 로딩 시작
      try {
        // 사용자 타입에 따라 다른 API 호출
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');
        
        console.log('사용자 타입 확인:', { user: user ? JSON.parse(user) : null, userType });
        console.log('isMerchant():', isMerchant());
        console.log('isUser():', isUser());
        
        let result;
        
        if (!user) {
          // 비로그인 상태: 좋아요 순으로 정렬된 추천
          console.log('비로그인 상태: /api/home 호출');
          result = await mainAPI.getHome();
        } else if (isMerchant()) {
          // 소상공인: 본인 가게의 카테고리에 맞는 AI 추천
          console.log('소상공인 상태: /api/home 호출 (백엔드에서 AI 추천 처리)');
          result = await mainAPI.getHome();
        } else if (isUser()) {
          // 일반 유저: 사용자가 선택한 카테고리에 맞는 AI 추천
          console.log('일반 유저 상태: /api/home 호출 (백엔드에서 AI 추천 처리)');
          result = await mainAPI.getHome();
        } else {
          // 기본값: 일반 홈 API 호출
          console.log('기본 상태: /api/home 호출');
          result = await mainAPI.getHome();
        }
        
        if (result.success && result.data) {
          console.log('API 응답 데이터 구조:', result.data);
          
          // API 명세서에 따른 응답 구조 처리
          let combinedData = [];
          
          if (result.data.stores || result.data.events) {
            // 명세서 구조: {stores: [], events: []}
            const stores = result.data.stores || [];
            const events = result.data.events || [];
            combinedData = [...stores, ...events];
            console.log('명세서 구조 데이터 - 가게:', stores.length, '개, 이벤트:', events.length, '개');
          } else if (Array.isArray(result.data)) {
            // 대체 구조: 직접 배열
            combinedData = result.data;
            console.log('직접 배열 데이터:', combinedData.length, '개');
          } else {
            console.log('알 수 없는 데이터 구조:', result.data);
            combinedData = [];
          }
         
         const data = buildSearchableData(combinedData);
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
     } finally {
       console.log('finally 블록 실행: isLoading을 false로 설정');
       setIsLoading(false); // 로딩 완료
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
    console.log('업데이트 버튼 클릭: 페이지 새로고침');
    // 단순히 페이지 새로고침
    window.location.reload();
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
            <UpdateButton onClick={handleUpdateClick} disabled={isLoading}>
              <UpdateIcon className={isLoading ? 'spinning' : ''}>🔄</UpdateIcon>
              {isLoading ? '업데이트 중...' : '업데이트'}
            </UpdateButton>
          </TopHeader>

          {/* 메인 제목 */}
          <SectionHeader>
            <SectionTitle>추천 카테고리:</SectionTitle>
            <MoreButton onClick={() => navigate('/morelistmain')}>더보기</MoreButton>
          </SectionHeader>

                                {/* 카드 그리드 */}
           {console.log('EventCardList에 전달할 데이터:', eventCardListData)}
           {console.log('isLoading 상태:', isLoading)}
           <EventCardList events={eventCardListData} maxItems={6}/>
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

