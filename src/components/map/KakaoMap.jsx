import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

/**
 * props:
 * - width, height: 컨테이너 크기
 * - center: { lat, lng }
 * - markers: [{ name, position: { lat, lng } }]
 * - kakaoKey: (옵션) 카카오 JS SDK 키. 전달하면 없을 때 자동 로드함. 전달 안 해도 페이지에 스크립트가 이미 있으면 동작.
 */
const KakaoMap = ({
  width = '100%',
  height = '400px',
  center = { lat: 37.5563, lng: 126.9244 },
  markers = [],
  kakaoKey, // optional
}) => {
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const drawablesRef = useRef([]); // markers + overlays (둘 다 setMap 지원)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // SDK 로더
  const loadKakaoSDK = () =>
    new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return reject(new Error('Window is undefined (SSR)'));
      if (window.kakao && window.kakao.maps) return resolve();

      // 스크립트가 이미 존재하는지 확인
      const existing = document.querySelector('script[data-kakao-sdk="true"]')
        || document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]');

      const onLoaded = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(resolve);
        } else {
          reject(new Error('카카오 SDK가 로드되었지만 window.kakao.maps가 없습니다.'));
        }
      };

      if (existing) {
        existing.addEventListener('load', onLoaded, { once: true });
        existing.addEventListener('error', () => reject(new Error('기존 카카오 SDK 로드 실패')), { once: true });
        // 혹시 이미 로드 완료 상태라면 즉시 처리
        if (existing.readyState === 'complete' || existing.getAttribute('data-loaded') === 'true') {
          onLoaded();
        }
        return;
      }

             if (!kakaoKey) {
         // 환경 변수에서 키 가져오기
         const envKey = import.meta.env.VITE_KAKAO_MAP_KEY;
         if (!envKey) {
           reject(new Error('카카오맵 API 키가 설정되지 않았습니다. VITE_KAKAO_MAP_KEY 환경 변수를 설정하거나 kakaoKey prop을 전달하세요.'));
           return;
         }
         kakaoKey = envKey;
       }

      const s = document.createElement('script');
      s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
      s.async = true;
      s.defer = true;
      s.setAttribute('data-kakao-sdk', 'true');
      s.addEventListener('load', () => {
        s.setAttribute('data-loaded', 'true');
        onLoaded();
      }, { once: true });
      s.addEventListener('error', () => reject(new Error('카카오 SDK 스크립트 로드 실패')), { once: true });
      document.head.appendChild(s);
    });

  // 공통 정리 함수
  const clearDrawables = () => {
    if (drawablesRef.current.length > 0) {
      for (const d of drawablesRef.current) {
        try {
          d && typeof d.setMap === 'function' && d.setMap(null);
        } catch (_) {}
      }
      drawablesRef.current = [];
    }
  };

  // 초기화
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 컨테이너는 항상 렌더되어 있어야 함
        if (!mapElement.current) {
          // 아주 드물게 첫 틱에서 null인 경우 살짝 대기
          await new Promise(r => setTimeout(r, 0));
        }
        if (!mapElement.current) throw new Error('지도 컨테이너를 찾을 수 없습니다.');

        // SDK 보장
        await loadKakaoSDK();

        if (cancelled) return;
        const { kakao } = window;

        // 지도 생성
        const mapOptions = {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: 3,
        };
        mapInstance.current = new kakao.maps.Map(mapElement.current, mapOptions);

        // 기본 마커 + 오버레이 (홍대입구역)
        const hongdaeLatLng = new kakao.maps.LatLng(37.5563, 126.9244);
        const hongdaeMarker = new kakao.maps.Marker({
          position: hongdaeLatLng,
          map: mapInstance.current,
        });

        const hongdaeOverlay = new kakao.maps.CustomOverlay({
          position: hongdaeLatLng,
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
          yAnchor: 1,
          map: mapInstance.current,
        });

        drawablesRef.current.push(hongdaeMarker, hongdaeOverlay);

        // 기본 장소들
        const places = [
          { name: '홍대 걷고싶은거리', lat: 37.5577, lng: 126.9246, emoji: '🚶' },
          { name: '홍대 클럽거리', lat: 37.5555, lng: 126.9225, emoji: '🎵' },
          { name: '홍대 상상마당', lat: 37.5565, lng: 126.9235, emoji: '🎨' },
          { name: '홍익대학교',   lat: 37.5518, lng: 126.9215, emoji: '🏫' },
          { name: '연남동',       lat: 37.5587, lng: 126.9248, emoji: '🍽️' },
        ];

        for (const p of places) {
          const m = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(p.lat, p.lng),
            map: mapInstance.current,
          });
          const ov = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(p.lat, p.lng),
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
                ${p.emoji} ${p.name}
              </div>
            `,
            xAnchor: 0.5,
            yAnchor: 1,
            map: mapInstance.current,
          });
          drawablesRef.current.push(m, ov);
        }

        // 최초 즐겨찾기 마커들
        if (Array.isArray(markers) && markers.length > 0) {
          for (const md of markers) {
            const pos = new kakao.maps.LatLng(md.position.lat, md.position.lng);
            const m = new kakao.maps.Marker({ position: pos, map: mapInstance.current });
            const ov = new kakao.maps.CustomOverlay({
              position: pos,
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
                  ❤️ ${md.name}
                </div>
              `,
              xAnchor: 0.5,
              yAnchor: 1,
              map: mapInstance.current,
            });
            drawablesRef.current.push(m, ov);
          }
        }

        if (!cancelled) setIsLoading(false);
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || '알 수 없는 오류');
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      clearDrawables();
      mapInstance.current = null;
    };
    // center/markers는 별도 effect에서 처리 (초기화 1회)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // center 변경 시 지도 중심 이동
  useEffect(() => {
    if (!mapInstance.current || !window.kakao || !window.kakao.maps) return;
    try {
      const { kakao } = window;
      mapInstance.current.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    } catch (_) {}
  }, [center]);

  // markers 변경 시 즐겨찾기 마커만 갱신
  useEffect(() => {
    if (!mapInstance.current || !window.kakao || !window.kakao.maps) return;
    const { kakao } = window;

    // 기존 즐겨찾기 마커/오버레이만 제거하려면 태깅이 필요하지만,
    // 간단하게 전체 drawables 지우고 기본요소 다시 그려도 됨.
    // 여기서는 "즐겨찾기만" 교체하기 위해, 우선 전체 지우고 다시 그림(안전/단순).
    // 성능 이슈 없으면 이 방식 추천.
    const rebuild = async () => {
      // 현재 중심/레벨 보존
      const centerLatLng = mapInstance.current.getCenter();
      const level = mapInstance.current.getLevel();

      // 지도 객체만 남기고 모두 제거
      clearDrawables();

      // 기본 요소 재생성
      const hongdaeLatLng = new kakao.maps.LatLng(37.5563, 126.9244);
      const hongdaeMarker = new kakao.maps.Marker({ position: hongdaeLatLng, map: mapInstance.current });
      const hongdaeOverlay = new kakao.maps.CustomOverlay({
        position: hongdaeLatLng,
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
        yAnchor: 1,
        map: mapInstance.current,
      });
      drawablesRef.current.push(hongdaeMarker, hongdaeOverlay);

      const places = [
        { name: '홍대 걷고싶은거리', lat: 37.5577, lng: 126.9246, emoji: '🚶' },
        { name: '홍대 클럽거리', lat: 37.5555, lng: 126.9225, emoji: '🎵' },
        { name: '홍대 상상마당', lat: 37.5565, lng: 126.9235, emoji: '🎨' },
        { name: '홍익대학교',   lat: 37.5518, lng: 126.9215, emoji: '🏫' },
        { name: '연남동',       lat: 37.5587, lng: 126.9248, emoji: '🍽️' },
      ];

      for (const p of places) {
        const m = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(p.lat, p.lng),
          map: mapInstance.current,
        });
        const ov = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(p.lat, p.lng),
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
              ${p.emoji} ${p.name}
            </div>
          `,
          xAnchor: 0.5,
          yAnchor: 1,
          map: mapInstance.current,
        });
        drawablesRef.current.push(m, ov);
      }

      if (Array.isArray(markers) && markers.length > 0) {
        for (const md of markers) {
          const pos = new kakao.maps.LatLng(md.position.lat, md.position.lng);
          const m = new kakao.maps.Marker({ position: pos, map: mapInstance.current });
          const ov = new kakao.maps.CustomOverlay({
            position: pos,
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
                ❤️ ${md.name}
              </div>
            `,
            xAnchor: 0.5,
            yAnchor: 1,
            map: mapInstance.current,
          });
          drawablesRef.current.push(m, ov);
        }
      }

      // 중심/레벨 복원
      mapInstance.current.setLevel(level);
      mapInstance.current.setCenter(centerLatLng);
    };

    rebuild();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  return (
    <MapContainer ref={mapElement} width={width} height={height}>
      {isLoading && (
        <Overlay>
          <LoadingMessage>
            <LoadingIcon>🔄</LoadingIcon>
            <LoadingText>지도를 불러오는 중...</LoadingText>
          </LoadingMessage>
        </Overlay>
      )}

             {error && (
         <Overlay>
           <ErrorMessage>
             <ErrorIcon>🗺️</ErrorIcon>
             <ErrorText>지도를 불러올 수 없습니다</ErrorText>
             <ErrorDetail style={{ whiteSpace: 'pre-line' }}>{error}</ErrorDetail>
             <ErrorHelp>
               💡 카카오맵 API 키 발급 방법:<br/>
               1. <a href="https://developers.kakao.com" target="_blank" rel="noopener noreferrer">Kakao Developers</a> 접속<br/>
               2. 애플리케이션 생성 후 JavaScript 키 복사<br/>
               3. .env 파일에 VITE_KAKAO_MAP_KEY=키값 추가
             </ErrorHelp>
           </ErrorMessage>
         </Overlay>
       )}
    </MapContainer>
  );
};

export default KakaoMap;

/* ======================= styles ======================= */
const MapContainer = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background-color: #f8f9fa;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(248, 249, 250, 0.85);
  pointer-events: none; /* 지도 인터랙션 막지 않음 */
`;

const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const ErrorHelp = styled.div`
  font-size: 1rem;
  color: #666;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
  line-height: 1.5;
  
  a {
    color: #007bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;
