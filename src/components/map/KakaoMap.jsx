import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const KakaoMap = ({ 
  width = '100%', 
  height = '400px', 
  center = { lat: 37.5563, lng: 126.9244 },
  markers = []
}) => {
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const isMountedRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('지도 초기화 시작');
        console.log('mapElement.current:', mapElement.current);
        console.log('window.kakao:', window.kakao);
        
        // kakao 객체가 전역으로 로드될 때까지 대기
        let retryCount = 0;
        const maxRetries = 100; // 재시도 횟수 더 증가
        
        while (!window.kakao || !window.kakao.maps) {
          if (retryCount >= maxRetries) {
            throw new Error('카카오맵 API 로드 시간 초과');
          }
          console.log(`카카오맵 API 로드 대기 중... (${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 50)); // 더 빠른 재시도
          retryCount++;
        }

        console.log('카카오맵 API 로드 확인됨');
        
        // 지도 컨테이너 ref가 할당될 때까지 대기
        retryCount = 0;
        while (!mapElement.current) {
          if (retryCount >= maxRetries) {
            throw new Error('지도 컨테이너 ref 할당 시간 초과');
          }
          console.log(`지도 컨테이너 ref 할당 대기 중... (${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 50));
          retryCount++;
        }
        
        console.log('지도 컨테이너 ref 할당 확인됨:', mapElement.current);
        
        // DOM에 실제로 마운트되었는지 확인
        retryCount = 0;
        while (!mapElement.current.parentNode) {
          if (retryCount >= maxRetries) {
            throw new Error('지도 컨테이너 DOM 마운트 시간 초과');
          }
          console.log(`지도 컨테이너 DOM 마운트 대기 중... (${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 50));
          retryCount++;
        }
        
        console.log('지도 컨테이너 DOM 마운트 확인됨');
        
        const { kakao } = window;
        
        // 기존 지도 인스턴스가 있다면 정리
        if (mapInstance.current) {
          try {
            mapInstance.current = null;
          } catch (error) {
            console.warn('기존 지도 인스턴스 정리 중 오류:', error);
          }
        }
        
        // 지도 초기화
        const mapOptions = {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: 3,
        };

        console.log('지도 초기화 시작:', mapOptions);
        console.log('지도 컨테이너 요소:', mapElement.current);
        
        mapInstance.current = new kakao.maps.Map(mapElement.current, mapOptions);
        console.log('지도 초기화 완료');

        // 기존 마커들 제거
        if (markersRef.current && markersRef.current.length > 0) {
          markersRef.current.forEach(marker => {
            try {
              if (marker && typeof marker.setMap === 'function') {
                marker.setMap(null);
              }
            } catch (error) {
              // 마커 제거 오류 무시
            }
          });
          markersRef.current = [];
        }

        // 홍대입구역 마커 추가 (기본 마커)
        const hongdaeMarker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(37.5563, 126.9244),
          map: mapInstance.current
        });

        // 홍대입구역 마커 커스텀 오버레이
        const hongdaeOverlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(37.5563, 126.9244),
          content: `
            <div style="
              background-color: #FEE502;
              color: #262626;
              padding: 8px 12px;
              border-radius: 20px;
              font-weight: 600;
              font-size: 14px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              white-space: nowrap;
              border: 2px solid white;
            ">
              📍 홍대입구역
            </div>
          `,
          xAnchor: 0.5,
          yAnchor: 1
        });
        hongdaeOverlay.setMap(mapInstance.current);

        // 동적 마커들 추가 (즐겨찾기 항목들) - 로그인된 경우에만
        console.log('즐겨찾기 마커 추가:', markers.length, '개');
        markers.forEach((markerData, index) => {
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(markerData.position.lat, markerData.position.lng),
            map: mapInstance.current
          });

          // 즐겨찾기 마커 커스텀 오버레이
          const overlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(markerData.position.lat, markerData.position.lng),
            content: `
              <div style="
                background-color: #FF6B6B;
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                white-space: nowrap;
                border: 2px solid white;
              ">
                ❤️ ${markerData.name}
              </div>
            `,
            xAnchor: 0.5,
            yAnchor: 1
          });
          overlay.setMap(mapInstance.current);
          
          markersRef.current.push(marker);
          markersRef.current.push(overlay);
        });

        // 주요 장소들 마커 추가 (기본 장소들)
        const places = [
          { name: '홍대 걷고싶은거리', lat: 37.5577, lng: 126.9246, emoji: '🚶' },
          { name: '홍대 클럽거리', lat: 37.5555, lng: 126.9225, emoji: '🎵' },
          { name: '홍대 상상마당', lat: 37.5565, lng: 126.9235, emoji: '🎨' },
          { name: '홍익대학교', lat: 37.5518, lng: 126.9215, emoji: '🏫' },
          { name: '연남동', lat: 37.5587, lng: 126.9248, emoji: '🍽️' }
        ];

        places.forEach(place => {
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(place.lat, place.lng),
            map: mapInstance.current
          });

          // 장소 마커 커스텀 오버레이
          const overlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(place.lat, place.lng),
            content: `
              <div style="
                background-color: white;
                color: #262626;
                padding: 6px 10px;
                border-radius: 15px;
                font-weight: 500;
                font-size: 12px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                border: 2px solid #FEE502;
                white-space: nowrap;
              ">
                ${place.emoji} ${place.name}
              </div>
            `,
            xAnchor: 0.5,
            yAnchor: 1
          });
          overlay.setMap(mapInstance.current);
          
          markersRef.current.push(marker);
          markersRef.current.push(overlay);
        });

        console.log('지도 렌더링 완료');
        setIsLoading(false);

      } catch (error) {
        console.error('지도 초기화 오류:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    // 컴포넌트가 마운트되고 ref가 할당된 후 지도 초기화 시도
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        initializeMap();
      }
    }, 200); // 200ms 지연 후 실행

    // Cleanup 함수
    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      
      // 마커들과 오버레이 제거
      if (markersRef.current && markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          try {
            if (marker && typeof marker.setMap === 'function') {
              marker.setMap(null);
            }
          } catch (error) {
            // 마커 제거 오류 무시
          }
        });
        markersRef.current = [];
      }
      
      // 지도 인스턴스 제거
      if (mapInstance.current) {
        try {
          mapInstance.current = null;
        } catch (error) {
          // 지도 인스턴스 제거 오류 무시
        }
      }
      
      // 지도 컨테이너 정리
      if (mapElement.current) {
        try {
          if (mapElement.current.innerHTML) {
            mapElement.current.innerHTML = '';
          }
        } catch (error) {
          // 지도 컨테이너 내용 제거 오류 무시
        }
      }
      
      // ref 정리
      mapElement.current = null;
    };

  }, []); // 의존성 배열을 비워서 컴포넌트 마운트 시에만 실행

  if (error) {
    return (
      <MapContainer width={width} height={height}>
        <ErrorMessage>
          <ErrorIcon>🗺️</ErrorIcon>
          <ErrorText>지도를 불러올 수 없습니다</ErrorText>
          <ErrorDetail>{error}</ErrorDetail>
        </ErrorMessage>
      </MapContainer>
    );
  }

  if (isLoading) {
    return (
      <MapContainer width={width} height={height}>
        <LoadingMessage>
          <LoadingIcon>🔄</LoadingIcon>
          <LoadingText>지도를 불러오는 중...</LoadingText>
        </LoadingMessage>
      </MapContainer>
    );
  }

  return <MapContainer ref={mapElement} width={width} height={height} />;
};

export default KakaoMap;

const MapContainer = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
`;

const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #666;
`;

const LoadingIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #666;
  padding: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorText = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ErrorDetail = styled.div`
  font-size: 1.2rem;
  color: #888;
`;
