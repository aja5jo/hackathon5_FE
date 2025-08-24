import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ApiService from '../../services/api';

function MerchantStoreList() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getMyStores();
      setStores(response.data || []);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
      setError('가게 목록을 불러오는데 실패했습니다.');
      // 임시 더미 데이터
      setStores([
        {
          id: 1,
          name: '카페 모모',
          address: '서울시 마포구 홍대입구역 123-45',
          category: 'CAFE',
          openAt: '09:00',
          closeAt: '22:00',
          createdAt: '2025-01-15',
          status: 'ACTIVE'
        },
        {
          id: 2,
          name: '홍대 클럽 나이트',
          address: '서울시 마포구 와우산로 21길 45',
          category: 'CLUB',
          openAt: '20:00',
          closeAt: '06:00',
          createdAt: '2025-01-10',
          status: 'ACTIVE'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (storeId) => {
    navigate(`/merchants/stores/${storeId}/edit`);
  };

  const handleDelete = async (storeId) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        // TODO: API 연동
        setStores(prev => prev.filter(store => store.id !== storeId));
        alert('가게가 삭제되었습니다.');
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const getCategoryLabel = (category) => {
    const categories = {
      'CAFE': '카페',
      'CLUB': '클럽',
      'SHOPPING': '쇼핑',
      'ETC': '기타',
      'FOOD': '음식점(술집)',
      'K_POP': 'KPOP',
      'ENTERTAINMENT': '오락',
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <LoadingText>가게 목록을 불러오는 중...</LoadingText>
        </LoadingContainer>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      
      <Content>
        <HeaderSection>
          <Title>내 가게 관리</Title>
          <Description>등록한 가게들을 조회하고 관리하세요</Description>
          <ActionButtons>
            <AddButton onClick={() => navigate('/merchants/stores')}>
              새 가게 등록
            </AddButton>
          </ActionButtons>
        </HeaderSection>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        {stores.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🏪</EmptyIcon>
            <EmptyTitle>등록된 가게가 없습니다</EmptyTitle>
            <EmptyDescription>
              첫 번째 가게를 등록해보세요!
            </EmptyDescription>
            <AddButton onClick={() => navigate('/merchants/stores')}>
              가게 등록하기
            </AddButton>
          </EmptyState>
        ) : (
          <StoreGrid>
            {stores.map((store) => (
              <StoreCard key={store.id}>
                <StoreHeader>
                  <StoreName>{store.name}</StoreName>
                  <CategoryBadge category={store.category}>
                    {getCategoryLabel(store.category)}
                  </CategoryBadge>
                </StoreHeader>
                
                <StoreInfo>
                  <InfoRow>
                    <InfoLabel>📍 주소:</InfoLabel>
                    <InfoValue>{store.address}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>🕐 운영시간:</InfoLabel>
                    <InfoValue>{store.openAt} ~ {store.closeAt}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>📅 등록일:</InfoLabel>
                    <InfoValue>{store.createdAt}</InfoValue>
                  </InfoRow>
                </StoreInfo>

                <ActionRow>
                  <EditButton onClick={() => handleEdit(store.id)}>
                    수정
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(store.id)}>
                    삭제
                  </DeleteButton>
                  <ViewButton onClick={() => navigate(`/store/${store.id}`)}>
                    상세보기
                  </ViewButton>
                </ActionRow>
              </StoreCard>
            ))}
          </StoreGrid>
        )}
      </Content>

      <Footer />
    </Container>
  );
}

export default MerchantStoreList;

// ===== styled =====
const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: 64px;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 1rem 0;
`;

const Description = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 2rem 0;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const AddButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 10px;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffe95a;
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const LoadingText = styled.div`
  font-size: 1.6rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
`;

const EmptyState = styled.div`
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
  margin: 0 0 2rem 0;
`;

const StoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const StoreCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
`;

const StoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const StoreName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #262626;
  margin: 0;
  flex: 1;
`;

const CategoryBadge = styled.div`
  padding: 0.5rem 1rem;
  background: #FEE502;
  color: #262626;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-left: 1rem;
`;

const StoreInfo = styled.div`
  margin-bottom: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
  align-items: flex-start;
`;

const InfoLabel = styled.span`
  font-size: 1.3rem;
  color: #666;
  min-width: 100px;
`;

const InfoValue = styled.span`
  font-size: 1.3rem;
  color: #262626;
  flex: 1;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
`;

const BaseActionButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
`;

const EditButton = styled(BaseActionButton)`
  background: #FEE502;
  color: #262626;
  border-color: #FEE502;

  &:hover {
    background: #ffe95a;
  }
`;

const DeleteButton = styled(BaseActionButton)`
  background: white;
  color: #dc2626;
  border-color: #dc2626;

  &:hover {
    background: #fef2f2;
  }
`;

const ViewButton = styled(BaseActionButton)`
  background: white;
  color: #262626;
  border-color: #e5e7eb;

  &:hover {
    background: #f9fafb;
  }
`;