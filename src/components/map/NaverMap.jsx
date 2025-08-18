import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const NaverMap = ({ 
  width = '100%', 
  height = '400px', 
  center = { lat: 37.5563, lng: 126.9244 },
  markers = []
}) => {
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.naver || !window.naver.maps) {
      console.error('네이버 지도 API가 로드되지 않았습니다.');
      return;
    }

    const { naver } = window;
    
    // 지도 초기화
    const mapOptions = {
      center: new naver.maps.LatLng(center.lat, center.lng),
      zoom: 16,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: naver.maps.MapTypeControlStyle.BUTTON,
        position: naver.maps.Position.TOP_RIGHT
      },
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_LEFT
      }
    };

    mapInstance.current = new naver.maps.Map(mapElement.current, mapOptions);

    // 기존 마커들 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 홍대입구역 마커 추가 (기본 마커)
    const hongdaeMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(37.5563, 126.9244),
      map: mapInstance.current,
      title: '홍대입구역',
      icon: {
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
          ">
            📍 홍대입구역
          </div>
        `,
        size: new naver.maps.Size(120, 40),
        anchor: new naver.maps.Point(60, 40)
      }
    });

    // 동적 마커들 추가 (즐겨찾기 항목들)
    markers.forEach(markerData => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(markerData.position.lat, markerData.position.lng),
        map: mapInstance.current,
        title: markerData.name,
        icon: {
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
          size: new naver.maps.Size(120, 40),
          anchor: new naver.maps.Point(60, 40)
        }
      });
      
      markersRef.current.push(marker);
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
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(place.lat, place.lng),
        map: mapInstance.current,
        title: place.name,
        icon: {
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
          size: new naver.maps.Size(100, 30),
          anchor: new naver.maps.Point(50, 30)
        }
      });
      
      markersRef.current.push(marker);
    });

  }, [center, markers]);

  return <MapContainer ref={mapElement} width={width} height={height} />;
};

export default NaverMap;

const MapContainer = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;