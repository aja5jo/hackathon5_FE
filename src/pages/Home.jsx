import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import SearchBox from '../components/home/SearchBox'
import Footer from '../components/common/Footer';
import EventCardList from '../components/common/EventCardList';
import dummyEvents from '../assets/dummy.json'
import HomeBannerSection from '../components/home/HomeBannerSection';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../utils/translations';
// import ApiService from '../utils/apiService'; // 백엔드 배포 시 사용

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // const [homeData, setHomeData] = useState(null); // 백엔드 배포 시 사용

  // 더미 검색 데이터
  const searchableData = [];
  
  // 더미 데이터에서 검색 가능한 데이터 구성
  dummyEvents.categories.forEach(categoryData => {
    // items 배열에서 모든 항목 추가
    if (categoryData.items) {
      categoryData.items.forEach(item => {
        searchableData.push({
          ...item,
          category: categoryData.category,
          type: item.type || 'store',
          description: item.desc || item.description || '홍대의 인기 가게입니다',
          image: item.thumbnail
        });
      });
    }
  });

  // 백엔드 배포 시 사용할 데이터 로드 함수
  /*
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const data = await ApiService.getHomeData();
        setHomeData(data);
      } catch (error) {
        console.error('홈 데이터 로드 실패:', error);
        // 에러 시 더미 데이터 사용
      }
    };
    
    loadHomeData();
  }, []);
  */

  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsSearching(true);
    
    // ===== 현재 더미 데이터 검색 (실제 사용 중) =====
    // 검색 로직
    const results = searchableData.filter(item => 
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.category.toLowerCase().includes(term.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(term.toLowerCase()))
    );
    
    setSearchResults(results);
    
    // ===== 실제 백엔드 배포 시 검색 API 사용 (주석처리) =====
    /*
    const performSearch = async () => {
      try {
        const searchResults = await ApiService.search(term);
        setSearchResults(searchResults.data || []);
      } catch (error) {
        console.error('검색 실패:', error);
        setSearchResults([]);
      }
    };
    
    performSearch();
    */
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

  // 업데이트 버튼 클릭 핸들러
  const handleUpdateClick = async () => {
    setIsUpdating(true);
    
    try {
      // ===== 현재 더미 데이터 버전 (실제 사용 중) =====
      // 간단한 새로고침 - 더미 데이터이므로 즉시 새로고침
      window.location.reload();
      
      // ===== 실제 백엔드 배포 시 버전 (주석처리) =====
      /*
      // 백엔드 API에서 최신 데이터 가져오기
      const updatedData = await ApiService.updateHomeData();
      
      // 새로운 데이터로 상태 업데이트
      setHomeData(updatedData);
      
      // 성공 메시지 표시
      alert('업데이트가 완료되었습니다!');
      
      // 페이지 새로고침 (선택사항)
      // window.location.reload();
      */
      
    } catch (error) {
      console.error('업데이트 중 오류:', error);
      alert('업데이트 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Container>
      {/* 메인 배너 섹션 */}
      <HomeBannerSection />

      {/* 검색 및 필터 섹션 */}
      <SearchSection>
        <SearchBox onSearch={handleSearch} />
      </SearchSection>

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
        // 기본 홈 화면 - 카드 그리드
        <MainContent>
          {/* 상단 헤더 */}
          <TopHeader>
            <BrandName>{t('brandName')}</BrandName>
            <UpdateButton onClick={handleUpdateClick} disabled={isUpdating}>
              <UpdateIcon className={isUpdating ? 'spinning' : ''}>🔄</UpdateIcon>
              {isUpdating ? '업데이트 중...' : '업데이트'}
            </UpdateButton>
          </TopHeader>

          {/* 메인 제목 */}
          <SectionHeader>
            <SectionTitle>{t('homeSubtitle')}:</SectionTitle>
            <MoreButton onClick={() => navigate('/morelistmain')}>{t('seeMore')}</MoreButton>
          </SectionHeader>

          {/* 카드 그리드 */}
          <EventCardList events={dummyEvents.categories} maxItems={6}/>
        </MainContent>
      )}
      
      <Footer/>
    </Container>
  )
}

export default Home

// 스타일 컴포넌트들
const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  margin: 0;
  line-height: 1.4;
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

