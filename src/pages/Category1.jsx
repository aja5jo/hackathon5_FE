import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { categoriesAPI, isMerchant } from '../services/api'
import { useCategoryToggle } from '../hooks/useCategoryToggle'



function Category1() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()
  
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isMerchantUser, setIsMerchantUser] = useState(false)

  // 컴포넌트 마운트 시 localStorage에서 기존 선택된 카테고리 불러오기
  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
    setSelectedCategories(storedCategories);
    
    // 사용자 타입 확인
    setIsMerchantUser(isMerchant());
  }, []);

  const categories = [
    { id: 'CAFE', name: '카페', image: '🍞' },
    { id: 'FOOD', name: '음식점 (술집 포함)', image: '🍲' },
    { id: 'SHOPPING', name: '쇼핑', image: '🛍️' },
    { id: 'ENTERTAINMENT', name: '오락', image: '🎤' },
    { id: 'K_POP', name: 'KPOP', image: '💃' },
    { id: 'CLUB', name: '클럽', image: '🎉' },
    { id: 'ETC', name: '기타', image: '🏘️' }
  ]

  // 카테고리 토글 커스텀 훅 사용
  const { toggleCategory, isLoading: isToggleLoading } = useCategoryToggle(
    (result) => {
      if (result.data && result.data.categories) {
        setSelectedCategories(result.data.categories);
      }
    },
    (error) => {
      console.log('카테고리 토글 에러:', error.message);
      // 401 에러가 발생해도 UI는 이미 업데이트되었으므로 사용자에게 알리지 않음
      // API 호출 실패는 로컬 상태로 처리됨
    }
  );

  const handleCategoryClick = async (categoryId) => {
    // 소상공인은 카테고리 선택 불가
    if (isMerchantUser) {
      console.log('소상공인은 카테고리 선택 기능을 사용할 수 없습니다.');
      return;
    }
    
    // 로딩 중이거나 인증되지 않은 경우 처리
    if (isToggleLoading) {
      console.log('로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    if (!isAuthenticated) {
      console.log('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    // 로컬 상태 먼저 업데이트
    setSelectedCategories(prev => {
      let newSelected;
      if (prev.includes(categoryId)) {
        // 이미 선택된 카테고리면 제거 (해제) - 경고 없이 바로 해제
        newSelected = prev.filter(c => c !== categoryId);
        console.log('카테고리 해제:', categoryId);
      } else {
        // 새로운 카테고리 추가 (최대 3개 제한)
        if (prev.length >= 3) {
          console.log('최대 3개까지만 선택할 수 있습니다.');
          return prev;
        }
        newSelected = [...prev, categoryId];
        console.log('카테고리 선택:', categoryId);
      }
      
      // localStorage에 저장
      localStorage.setItem('selectedCategories', JSON.stringify(newSelected));
      
      return newSelected;
    });
    
    // API 호출은 선택사항으로 하고, 에러가 발생해도 UI는 업데이트되도록 함
    try {
      await toggleCategory(categoryId, selectedCategories, 3);
    } catch (error) {
      console.log('API 호출 실패했지만 UI는 업데이트됨:', error.message);
      // API 호출이 실패해도 UI 상태는 이미 업데이트되었으므로 사용자에게 알리지 않음
    }
  }

  const handleNext = async () => {
    if (selectedCategories.length === 0) {
      console.log('최소 1개 이상의 카테고리를 선택해주세요.')
      return
    }
    
    // 명세서에 카테고리 저장 API가 없으므로 선택만 하고 다음 페이지로 이동
    console.log('선택된 카테고리:', selectedCategories);
    navigate('/')
  }

  return (
    <Container>
      <Header>
        <HeaderText>카테고리 선택 페이지/유저</HeaderText>
        <HeaderIcons>
          <Icon>💬</Icon>
          <Icon>⬜</Icon>
          <Icon>✂️</Icon>
          <Icon>🔍</Icon>
          <Icon>⬇️</Icon>
          <Icon>⋯</Icon>
        </HeaderIcons>
      </Header>

      <MainContent>
        <LeftSection>
          <Title>카테고리 선택</Title>
          <Description>
            관심 카테고리 최대 3개까지 선택하면 취향에 맞는 가게/이벤트 들을 추천해드려요
          </Description>
        </LeftSection>

        <RightSection>
          {isMerchantUser ? (
            <MerchantMessage>
              <MessageTitle>소상공인은 카테고리 선택이 불가능합니다</MessageTitle>
              <MessageText>
                소상공인 계정으로는 카테고리 선택 기능을 사용할 수 없습니다.<br/>
                일반 유저 계정으로 로그인하시거나, 홈 화면으로 이동해주세요.
              </MessageText>
              <HomeButton onClick={() => navigate('/')}>
                홈 화면으로 이동
              </HomeButton>
            </MerchantMessage>
          ) : (
            <CategoryGrid>
              {categories.map(category => (
                <CategoryCard
                  key={category.id}
                  $selected={selectedCategories.includes(category.id)}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <ImageContainer>
                    <CategoryImage>{category.image}</CategoryImage>
                  </ImageContainer>
                  <TextContainer>
                    <CategoryName>{category.name}</CategoryName>
                  </TextContainer>
                </CategoryCard>
              ))}
            </CategoryGrid>
          )}
        </RightSection>
      </MainContent>

      {!isMerchantUser && (
        <NextButton onClick={handleNext}>
          Next
        </NextButton>
      )}
    </Container>
  )
}

export default Category1

const Container = styled.div`
  background-color: #ffffff;
  position: relative;
  width: 100%;
`

const Header = styled.div`
  background-color: #333;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeaderText = styled.span`
  font-size: 1.4rem;
`

const HeaderIcons = styled.div`
  display: flex;
  gap: 1rem;
`

const Icon = styled.span`
  font-size: 1.6rem;
  cursor: pointer;
`

const MainContent = styled.div`
  display: flex;
  min-height: calc(100vh - 120px);
  padding: 2rem;
`

const LeftSection = styled.div`
  flex: 1;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
`

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  color: #262626;
  margin-bottom: 2rem;
`

const Description = styled.p`
  font-size: 1.8rem;
  color: #666;
  line-height: 1.6;
`

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 600px;
  width: 100%;
`

const CategoryCard = styled.div`
  background-color: white;
  border: 2px solid #E5E5E5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  ${props => props.$selected && `
    opacity: 0.6;
    background-color: rgba(255, 107, 53, 0.1);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
  `}

  &:nth-child(7) {
    grid-column: 1 / -1;
    max-width: 300px;
    margin: 0 auto;
  }
`

const ImageContainer = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-bottom: 1px solid #E5E5E5;
  padding: 1rem;
`

const CategoryImage = styled.div`
  font-size: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const TextContainer = styled.div`
  padding: 1.5rem;
  text-align: center;
  background-color: white;
`

const CategoryName = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: #262626;
  line-height: 1.4;
`

const NextButton = styled.button`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #262626;
  color: white;
  border: none;
  padding: 1.5rem 3rem;
  border-radius: 8px;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #333;
    transform: translateX(-50%) translateY(-2px);
  }
`

const MerchantMessage = styled.div`
  text-align: center;
  padding: 4rem;
  background-color: #f0f0f0;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
`

const MessageTitle = styled.h2`
  font-size: 2.4rem;
  color: #333;
  margin-bottom: 1.5rem;
`

const MessageText = styled.p`
  font-size: 1.6rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`

const HomeButton = styled.button`
  background-color: #262626;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #333;
  }
`