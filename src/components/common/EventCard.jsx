import React, { useState, useEffect, memo, useCallback } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import offlike from '../../assets/offlike.svg'
import onlike from '../../assets/onlike.svg'

import { useAuth } from '../../contexts/AuthContext'
import { isMerchant, favoritesAPI } from '../../services/api'
// import ApiService from '../../utils/apiService'; // 백엔드 배포 시 사용

const EventCard = memo(({ event, excludeStatuses = [], onRemove }) => {
  console.log('EventCard 렌더링:', event);
  
  const navigate = useNavigate();
  
  const { isAuthenticated } = useAuth();
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(event.likeCount || 0);
  const [isMerchantUser, setIsMerchantUser] = useState(false);

  useEffect(() => {
    // 사용자 타입 확인
    setIsMerchantUser(isMerchant());
  }, []);

  useEffect(() => {
    // API 응답의 liked 필드를 사용하여 좋아요 상태 설정
    const checkFavoriteStatus = () => {
      try {
        console.log('EventCard 좋아요 상태 확인:', { 
          eventId: event.id, 
          eventType: event.type, 
          liked: event.liked,
          likeCount: event.likeCount 
        });
        
        // API 응답에서 받은 liked 상태를 사용
        setLike(event.liked || false);
        setLikeCount(event.likeCount || 0);
        
      } catch (error) {
        console.error('즐겨찾기 상태 확인 중 오류:', error);
        setLike(false);
        setLikeCount(0);
      }
    };
    checkFavoriteStatus();
  }, [event.id, event.liked, event.likeCount]);

  const toggleLike = useCallback((e) => {
    e.stopPropagation();
    
    // 소상공인은 좋아요 기능 사용 불가
    if (isMerchantUser) {
      console.log('소상공인은 좋아요 기능을 사용할 수 없습니다.');
      return;
    }
    
    if (!isAuthenticated) {
      console.log('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    
    // ===== API 명세서에 맞는 백엔드 API 호출 =====
    const performToggle = async () => {
      try {
        console.log('좋아요 토글 시작:', { eventId: event.id, eventType: event.type, currentLike: like });
        
        let result;
        const eventType = (event.type || '').toLowerCase();
        
        // API 명세서에 따른 엔드포인트 호출
        if (eventType === 'store') {
          result = await favoritesAPI.toggleStoreFavorite(event.id);
        } else if (eventType === 'event') {
          result = await favoritesAPI.toggleEventFavorite(event.id);
        } else if (eventType === 'popup') {
          result = await favoritesAPI.togglePopupFavorite(event.id);
        } else {
          console.error('알 수 없는 이벤트 타입:', eventType);
          return;
        }
        
        console.log('API 응답:', result);
        
        if (result.success && result.data) {
          // API 응답에 따라 상태 업데이트
          const newLiked = result.data.liked;
          const newLikeCount = result.data.likeCount;
          
          setLike(newLiked);
          setLikeCount(newLikeCount);
          
          console.log('좋아요 상태 업데이트:', { liked: newLiked, likeCount: newLikeCount });
          
          // 좋아요가 해제된 경우 부모 컴포넌트에 제거 알림
          if (!newLiked && onRemove) {
            onRemove(event.id);
          }
          
          // 버킷리스트 업데이트를 위한 이벤트 발생
          window.dispatchEvent(new Event('favoritesChanged'));
          
          // 부모 컴포넌트에 상태 변경 알림 (새로 추가)
          if (onRemove) {
            // 좋아요 상태가 변경되었음을 알림 (id와 함께)
            onRemove(event.id, newLiked);
          }
        } else {
          console.error('API 응답이 성공이 아님:', result);
        }
      } catch (error) {
        console.error('즐겨찾기 토글 중 오류:', error);
        alert('즐겨찾기 처리 중 오류가 발생했습니다.');
      }
    };
    
    performToggle();
  }, [event.id, event.type, like, isAuthenticated, navigate, onRemove, isMerchantUser]);

  const handleCardClick = useCallback(() => {
    // 비로그인 상태에서는 로그인 페이지로 이동
    if (!isAuthenticated) {
      console.log('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    
    const type = (event.type || '').toLowerCase();
    if (type === 'store') {
      navigate(`/store/${event.id}`);
    } else if (type === 'popup') {
      navigate(`/popup/${event.id}`);
    } else {
      navigate(`/events/${event.id}`);
    }
  }, [event.type, event.id, navigate, isAuthenticated]);

  const shouldShowStatus = Boolean(event.status) && !excludeStatuses.includes(event.status);

  return (
    <Card onClick={handleCardClick}>
      <EventImage>
        {event.thumbnail && (
          <img src={event.thumbnail} alt={event.name} />
        )}
        <ButtonContainer>
          {/* 좋아요 버튼 */}
          <LikeContainer>
            <LikeButton 
              onClick={toggleLike}
              disabled={isMerchantUser}
              style={{
                opacity: isMerchantUser ? 0.5 : 1,
                cursor: isMerchantUser ? 'not-allowed' : 'pointer'
              }}
            >
              {like ? '❤️' : '🤍'}
            </LikeButton>
            <LikeCount>{likeCount}</LikeCount>
          </LikeContainer>
          
          {/* 즐겨찾기 버튼
          <FavoriteContainer>
            <FavoriteButton onClick={toggleLike}>
              {like ? '⭐' : '☆'}
            </FavoriteButton>
          </FavoriteContainer> */}
        </ButtonContainer>
        {shouldShowStatus && <StatusBadge status={event.status}>{event.status}</StatusBadge>}
      </EventImage>
      
      <EventContent>
        <CategoryTags>
          <CategoryTag>{event.category}</CategoryTag>
          <CategoryTag>{event.type}</CategoryTag>
        </CategoryTags>
        <EventTitle>{event.name}</EventTitle>
        <EventDescription>{event.description || event.desc}</EventDescription>
        <EventInfo>
          <InfoItem>📅 {event.startDate && event.endDate ? `${event.startDate} ~ ${event.endDate}` : event.startDate || event.endDate}</InfoItem>
          <InfoItem>📍 {typeof event.location === 'object' ? '홍대' : (event.location || '홍대')}</InfoItem>
        </EventInfo>
      </EventContent>
    </Card>
  );
});

export default EventCard;

// 팝업 페이지와 동일한 스타일 컴포넌트들
const Card = styled.div`
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
`;

const EventImage = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LikeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const FavoriteContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FavoriteButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor: pointer;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const LikeButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const LikeCount = styled.span`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 500;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 0.5rem 1rem;
  background-color: ${props => 
    props.status === '진행중' ? '#10B981' : 
    props.status === '예정' ? '#F59E0B' : '#6B7280'
  };
  color: white;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const EventContent = styled.div`
  padding: 2rem;
`;

const CategoryTags = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 1rem;
`;

const CategoryTag = styled.div`
  display: inline-block;
  padding: 0.4rem 1rem;
  background-color: #FEE502;
  color: #262626;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const EventTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 1rem 0;
  line-height: 1.3;
`;

const EventDescription = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  font-size: 1.3rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;