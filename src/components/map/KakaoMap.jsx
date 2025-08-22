import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    // kakao 객체가 전역으로 로드된 경우만 실행
    if (!window.kakao || !window.kakao.maps) {
      return;
    }

    const { kakao } = window;
    
    isMountedRef.current = true;
    
    kakao.maps.load(() => {
      // 컴포넌트가 언마운트된 경우 실행하지 않음
      if (!isMountedRef.current) return;
      
      // 지도 컨테이너가 DOM에 존재하는지 확인
      if (!mapElement.current || !mapElement.current.parentNode) {
        return;
      }
      
      // 기존 지도 인스턴스가 있다면 정리
      if (mapInstance.current) {
        try {
          mapInstance.current = null;
        } catch (error) {
          console.warn('기존 지도 인스턴스 정리 중 오류:', error);
        }
      }
      
      try {
        // 지도 초기화
        const mapOptions = {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: 3,
        };

        mapInstance.current = new kakao.maps.Map(mapElement.current, mapOptions);

        // 기존 마커들 제거 (더 안전한 방식)
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

        // 동적 마커들 추가 (즐겨찾기 항목들)
        markers.forEach(markerData => {
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

      } catch (error) {
        return;
      }
    });

    // Cleanup 함수
    return () => {
      isMountedRef.current = false;
      
      // 마커들과 오버레이 제거 (더 안전한 방식)
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
          // 지도 컨테이너가 여전히 DOM에 존재하는지 확인
          if (mapElement.current && mapElement.current.parentNode) {
            // 지도 컨테이너의 내용을 안전하게 제거
            try {
              if (mapElement.current.innerHTML) {
                mapElement.current.innerHTML = '';
              }
            } catch (error) {
              // 지도 컨테이너 내용 제거 오류 무시
            }
            mapInstance.current = null;
          }
        } catch (error) {
          // 지도 인스턴스 제거 오류 무시
        }
      }
      
      // ref 정리
      mapElement.current = null;
    };

  }, [center, markers]);

  return <MapContainer ref={mapElement} width={width} height={height} />;
};

export default KakaoMap;

const MapContainer = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;
