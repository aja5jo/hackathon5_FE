import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import offlike from '../../assets/offlike.svg'
import onlike from '../../assets/onlike.svg'
import { useTranslation } from '../../utils/translations'
import { useAuth } from '../../contexts/AuthContext'
// import ApiService from '../../utils/apiService'; // 백엔드 배포 시 사용

const EventCard = ({ event, excludeStatuses = [] }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(event.likeCount || 0);

  useEffect(() => {
    const checkFavoriteStatus = () => {
      try {
        const savedFavorites = localStorage.getItem('userFavorites');
        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites);
          const isLiked = favorites.some(fav => fav.id === event.id);
          setLike(isLiked);
        } else {
          setLike(event.liked || false);
          if (event.liked) {
            const newFavorite = {
              id: event.id,
              name: event.name,
              category: event.category,
              type: event.type,
              description: event.description || event.desc,
              image: event.thumbnail,
              location: event.location || { lat: 37.5563, lng: 126.9244 },
              likeCount: event.likeCount || 0
            };
            const existingFavorites = localStorage.getItem('userFavorites') || '[]';
            const favorites = JSON.parse(existingFavorites);
            if (!favorites.some(fav => fav.id === event.id)) {
              favorites.push(newFavorite);
              localStorage.setItem('userFavorites', JSON.stringify(favorites));
              window.dispatchEvent(new Event('favoritesChanged'));
            }
          }
        }
      } catch (error) {
        console.error('즐겨찾기 상태 확인 중 오류:', error);
        setLike(event.liked || false);
      }
    };
    checkFavoriteStatus();
  }, [event.id, event.liked]);

  const toggleLike = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    
    // ===== 현재 localStorage 버전 (실제 사용 중) =====
    try {
      const savedFavorites = localStorage.getItem('userFavorites') || '[]';
      const favorites = JSON.parse(savedFavorites);
      if (like) {
        const updatedFavorites = favorites.filter(fav => fav.id !== event.id);
        localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
        setLike(false);
        setLikeCount(prev => prev - 1);
      } else {
        const newFavorite = {
          id: event.id,
          name: event.name,
          category: event.category,
          type: event.type,
          description: event.description || event.desc,
          image: event.thumbnail,
          location: event.location || { lat: 37.5563, lng: 126.9244 },
          likeCount: event.likeCount || 0
        };
        favorites.push(newFavorite);
        localStorage.setItem('userFavorites', JSON.stringify(favorites));
        setLike(true);
        setLikeCount(prev => prev + 1);
      }
      window.dispatchEvent(new Event('favoritesChanged'));
    } catch (error) {
      console.error('즐겨찾기 토글 중 오류:', error);
    }
    
    // ===== 백엔드 배포 시 API 버전 (주석처리) =====
    /*
    const performToggle = async () => {
      try {
        const eventType = (event.type || '').toLowerCase();
        let result;
        
        if (like) {
          // 즐겨찾기 제거
          result = await ApiService.removeFromFavorites(event.id);
        } else {
          // 즐겨찾기 추가
          if (eventType === 'store') {
            result = await ApiService.addStoreToFavorites(event.id);
          } else if (eventType === 'event') {
            result = await ApiService.addEventToFavorites(event.id);
          } else if (eventType === 'popup') {
            result = await ApiService.addPopupToFavorites(event.id);
          }
        }
        
        if (result.success) {
          setLike(!like);
          setLikeCount(prev => like ? prev - 1 : prev + 1);
          window.dispatchEvent(new Event('favoritesChanged'));
        }
      } catch (error) {
        console.error('즐겨찾기 토글 중 오류:', error);
        alert('즐겨찾기 처리 중 오류가 발생했습니다.');
      }
    };
    
    performToggle();
    */
  };

  const handleCardClick = () => {
    const type = (event.type || '').toLowerCase();
    if (type === 'store') {
      navigate(`/store/${event.id}`);
    } else if (type === 'popup') {
      navigate(`/popup/${event.id}`);
    } else {
      navigate(`/events/${event.id}`);
    }
  };

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
            <LikeButton onClick={toggleLike}>
              {like ? '❤️' : '🤍'}
            </LikeButton>
            <LikeCount>{likeCount}</LikeCount>
          </LikeContainer>
          
          {/* 즐겨찾기 버튼 */}
          <FavoriteContainer>
            <FavoriteButton onClick={toggleLike}>
              {like ? '⭐' : '☆'}
            </FavoriteButton>
          </FavoriteContainer>
        </ButtonContainer>
        {shouldShowStatus && <StatusBadge status={event.status}>{event.status}</StatusBadge>}
      </EventImage>
      
      <EventContent>
        <CategoryTag>{event.category}</CategoryTag>
        <EventTitle>{event.name}</EventTitle>
        <EventDescription>{event.description || event.desc}</EventDescription>
        <EventInfo>
          <InfoItem>📅 {event.startDate && event.endDate ? `${event.startDate} ~ ${event.endDate}` : event.startDate || event.endDate}</InfoItem>
          <InfoItem>📍 {event.location || '홍대'}</InfoItem>
        </EventInfo>
      </EventContent>
    </Card>
  );
};

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

const CategoryTag = styled.div`
  display: inline-block;
  padding: 0.4rem 1rem;
  background-color: #FEE502;
  color: #262626;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
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