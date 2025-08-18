# 홍대 지역 정보 앱

React + Vite를 사용한 홍대 지역 가게 및 이벤트 정보 제공 웹 애플리케이션입니다.

## 주요 기능

- 홍대 지역 가게 및 이벤트 정보 제공
- 즐겨찾기 및 버킷리스트 기능
- 카카오 지도 API를 활용한 위치 정보 표시
- 반응형 웹 디자인

## 설치 및 실행

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```
VITE_KAKAO_MAP_KEY=your_kakao_map_api_key_here
```

### 카카오 지도 API 키 발급 방법

1. [Kakao Developers](https://developers.kakao.com/)에 접속
2. 애플리케이션 생성
3. JavaScript 키 발급
4. 웹 플랫폼 등록 (도메인 설정)
5. 발급받은 JavaScript 키를 `VITE_KAKAO_MAP_KEY`에 설정

3. 개발 서버 실행
```bash
npm run dev
```

## 기술 스택

- React 18
- Vite
- Styled Components
- Kakao Maps API
- React Router

## 프로젝트 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── contexts/      # React Context
├── utils/         # 유틸리티 함수
├── styles/        # 스타일 관련 파일
└── assets/        # 이미지 등 정적 파일
```

## 변경 사항

### 네이버 지도 → 카카오 지도 변경

- `NaverMap` 컴포넌트를 `KakaoMap` 컴포넌트로 변경
- `main.jsx`에서 카카오 지도 API 로드 로직으로 변경
- 환경 변수를 `VITE_KAKAO_MAP_KEY`로 변경
