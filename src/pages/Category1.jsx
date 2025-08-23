import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { categoriesAPI } from '../services/api'



function Category1() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()
  
  const [selectedCategories, setSelectedCategories] = useState([])

  const categories = [
    { id: 'cafe', name: '카페', image: '🍞' },
    { id: 'restaurant', name: '음식점 (술집 포함)', image: '🍲' },
    { id: 'shopping', name: '쇼핑', image: '🛍️' },
    { id: 'entertainment', name: '오락', image: '🎤' },
    { id: 'kpop', name: 'KPOP', image: '💃' },
    { id: 'club', name: '클럽', image: '🎉' },
    { id: 'etc', name: '기타', image: '🏘️' }
  ]

  const handleCategoryClick = async (categoryId) => {
    // 로딩 중이거나 인증되지 않은 경우 처리
    if (isLoading) {
      alert('로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    // ===== 더미데이터 버전 (주석처리) =====
    /*
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // 이미 선택된 카테고리면 제거
        return prev.filter(id => id !== categoryId)
      } else {
        // 최대 3개까지만 선택 가능
        if (prev.length < 3) {
          return [...prev, categoryId]
        } else {
          alert('최대 3개까지만 선택할 수 있습니다.');
          return prev
        }
      }
    })
    */
    
    // ===== 백엔드 API 버전 (활성화) =====
    try {
      // 3개 제한 로직: 이미 3개가 선택되어 있고, 새로운 카테고리를 추가하려는 경우
      if (!selectedCategories.includes(categoryId) && selectedCategories.length >= 3) {
        alert('최대 3개까지만 선택할 수 있습니다.');
        return;
      }

      const result = await categoriesAPI.toggleCategory(categoryId);
      
      if (result.success) {
        console.log('카테고리 토글 성공:', result.message);
        if (result.data && result.data.categories) {
          setSelectedCategories(result.data.categories);
        }
      } else {
        if (result.code === 400) {
          alert(result.message || '카테고리 설정에 실패했습니다.');
        } else if (result.code === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else if (result.code === 403) {
          alert('접근 권한이 없습니다.');
        } else {
          alert(result.message || '카테고리 설정 중 오류가 발생했습니다.');
        }
      }
      
    } catch (error) {
      console.error('카테고리 설정 API 오류:', error);
      alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
    }
  }

  const handleNext = async () => {
    if (selectedCategories.length === 0) {
      alert('최소 1개 이상의 카테고리를 선택해주세요.')
      return
    }
    
    // ===== 더미데이터 버전 (주석처리) =====
    /*
    // 선택된 카테고리를 localStorage에 저장
    localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories))
    localStorage.setItem('hasSelectedCategories', 'true')
    
    // ===== 수정: Category2 대신 main으로 이동 =====
    navigate('/')
    // ===== 기존 코드: Category2로 이동 (주석 처리) =====
    // navigate('/category2')
    // ===== 수정 끝 =====
    */
    
    // ===== 백엔드 API 버전 (활성화) =====
    try {
      const result = await categoriesAPI.saveUserCategories({ categories: selectedCategories });
      
      if (result.success) {
        console.log('카테고리 저장 성공:', result.message);
        navigate('/')
      } else {
        alert(result.message || '카테고리 저장에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('카테고리 저장 실패:', error);
      alert('카테고리 저장에 실패했습니다.');
    }
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
          <CategoryGrid>
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                selected={selectedCategories.includes(category.id)}
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
        </RightSection>
      </MainContent>

      <NextButton onClick={handleNext}>
        Next
      </NextButton>
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

  ${props => props.selected && `
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