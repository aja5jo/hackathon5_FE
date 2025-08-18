import React from 'react';

// 다국어 지원을 위한 번역 객체
export const translations = {
  ko: {
    // 헤더
    categories: '카테고리',
    events: '이벤트',
    popup: '이번주 팝업 스테이션',
    bucketlist: '즐겨찾기/버킷리스트',
    login: '로그인',
    logout: '로그아웃',
    
    // 즐겨찾기 관련
    favoriteLoginMsg: '즐겨찾기 기능을 사용하려면 로그인이 필요합니다.',
    
    // 홈페이지
    searchPlaceholder: '가게이름/이벤트를 검색하세요',
    brandName: '꼬꼬리스트',
    homeSubtitle: '나의 취향맞춤 가게 이벤트',
    seeMore: '자세히 보기',
    
    // 카테고리 선택 페이지
    categorySelection: '카테고리 선택',
    categoryDescription: '관심 카테고리 최대 3개까지 선택하면 취향에 맞는 가게/이벤트들을 추천해드려요',
    next: 'Next',
    
    // 카테고리명
    cafe: '카페',
    restaurant: '음식점 (술집 포함)',
    shopping: '쇼핑',
    entertainment: '오락',
    kpop: 'KPOP',
    club: '클럽',
    etc: '기타',
    
    // 카테고리명 (API용)
    categoryCAFE: '카페',
    categoryFOOD: '음식점',
    categoryKPOP: 'KPOP',
    categoryENTERTAINMENT: '오락',
    categorySHOPPING: '쇼핑',
    categoryCLUB: '클럽',
    categoryETC: '기타',
    
    // 타입별 텍스트
    typeSTORE: '가게',
    typeEVENT: '이벤트',
    typePOPUP: '팝업',
    
    // 즐겨찾기 페이지
    myFavorites: '내 즐겨찾기 모음:',
    noFavorites: '즐겨찾기한 항목이 없습니다',
    noFavoritesDesc: '관심있는 가게나 이벤트에 하트를 눌러보세요!',
    favoriteLocation: '즐겨찾기 위치',
    favoriteLocationDesc: '즐겨찾기한 장소들이 지도에 표시됩니다',
    removeFromFavorites: '즐겨찾기에서 제거',
    
    // 공통
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    notFound: '페이지를 찾을 수 없습니다',
    like: '좋아요',
    store: '가게',
    event: '이벤트',
    review: '리뷰',
    writeReview: '내 리뷰 작성 (with 별점 제도)',
    photos: '관련 사진들'
  },
  
  en: {
    // Header
    categories: 'Categories',
    events: 'Events',
    popup: 'This Week\'s Pop-up Station',
    bucketlist: 'Favorites/Bucket List',
    login: 'Login',
    logout: 'Logout',
    
    // Favorites
    favoriteLoginMsg: 'Login required to use favorites feature.',
    
    // Homepage
    searchPlaceholder: 'Search for stores or events',
    brandName: 'KOKO List',
    homeSubtitle: 'My personalized stores and events',
    seeMore: 'See More',
    
    // Category Selection Page
    categorySelection: 'Category Selection',
    categoryDescription: 'Select up to 3 categories of interest and we\'ll recommend stores/events that match your taste',
    next: 'Next',
    
    // Category Names
    cafe: 'Cafe',
    restaurant: 'Restaurant (Including Bars)',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    kpop: 'K-POP',
    club: 'Club',
    etc: 'Others',
    
    // Categories (API)
    categoryCAFE: 'Cafe',
    categoryFOOD: 'Food',
    categoryKPOP: 'K-POP',
    categoryENTERTAINMENT: 'Entertainment',
    categorySHOPPING: 'Shopping',
    categoryCLUB: 'Club',
    categoryETC: 'Others',
    
    // Types
    typeSTORE: 'Store',
    typeEVENT: 'Event',
    typePOPUP: 'Pop-up',
    
    // Favorites page
    myFavorites: 'My Favorites:',
    noFavorites: 'No favorites yet',
    noFavoritesDesc: 'Try hearting some stores or events you like!',
    favoriteLocation: 'Favorite Locations',
    favoriteLocationDesc: 'Your favorite places are shown on the map',
    removeFromFavorites: 'Remove from favorites',
    
    // Common
    loading: 'Loading...',
    error: 'An error occurred',
    notFound: 'Page not found',
    like: 'Like',
    store: 'Store',
    event: 'Event',
    review: 'Review',
    writeReview: 'Write My Review (with Rating System)',
    photos: 'Related Photos'
  },
  
  ja: {
    // Header
    categories: 'カテゴリ',
    events: 'イベント',
    popup: '今週のポップアップステーション',
    bucketlist: 'お気に入り/バケットリスト',
    login: 'ログイン',
    logout: 'ログアウト',
    
    // Favorites
    favoriteLoginMsg: 'お気に入り機能を使用するにはログインが必要です。',
    
    // Homepage
    searchPlaceholder: '店舗やイベントを検索してください',
    brandName: 'KOKO リスト',
    homeSubtitle: 'あなたの好みに合わせた店舗イベント',
    seeMore: '詳細を見る',
    
    // Category Selection Page
    categorySelection: 'カテゴリ選択',
    categoryDescription: '興味のあるカテゴリを最大3つまで選択すると、あなたの好みに合った店舗/イベントをおすすめします',
    next: '次へ',
    
    // Category Names
    cafe: 'カフェ',
    restaurant: 'レストラン（バー含む）',
    shopping: 'ショッピング',
    entertainment: 'エンターテイメント',
    kpop: 'K-POP',
    club: 'クラブ',
    etc: 'その他',
    
    // Categories (API)
    categoryCAFE: 'カフェ',
    categoryFOOD: '飲食店',
    categoryKPOP: 'K-POP',
    categoryENTERTAINMENT: 'エンターテイメント',
    categorySHOPPING: 'ショッピング',
    categoryCLUB: 'クラブ',
    categoryETC: 'その他',
    
    // Types
    typeSTORE: '店舗',
    typeEVENT: 'イベント',
    typePOPUP: 'ポップアップ',
    
    // Favorites page
    myFavorites: 'お気に入り:',
    noFavorites: 'お気に入りがありません',
    noFavoritesDesc: '気になる店舗やイベントにハートを押してみてください！',
    favoriteLocation: 'お気に入り位置',
    favoriteLocationDesc: 'お気に入りの場所が地図に表示されます',
    removeFromFavorites: 'お気に入りから削除',
    
    // Common
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    notFound: 'ページが見つかりません',
    like: 'いいね',
    store: '店舗',
    event: 'イベント',
    review: 'レビュー',
    writeReview: 'レビューを書く（評価システム付き）',
    photos: '関連写真'
  },
  
  zh: {
    // Header
    categories: '分类',
    events: '活动',
    popup: '本周快闪站',
    bucketlist: '收藏/愿望清单',
    login: '登录',
    logout: '登出',
    
    // Favorites
    favoriteLoginMsg: '使用收藏功能需要登录。',
    
    // Homepage
    searchPlaceholder: '搜索商店或活动',
    brandName: 'KOKO 列表',
    homeSubtitle: '我的个性化商店和活动',
    seeMore: '查看更多',
    
    // Category Selection Page
    categorySelection: '分类选择',
    categoryDescription: '最多选择3个感兴趣的分类，我们将为您推荐符合您品味的商店/活动',
    next: '下一步',
    
    // Category Names
    cafe: '咖啡厅',
    restaurant: '餐厅（含酒吧）',
    shopping: '购物',
    entertainment: '娱乐',
    kpop: 'K-POP',
    club: '俱乐部',
    etc: '其他',
    
    // Categories (API)
    categoryCAFE: '咖啡厅',
    categoryFOOD: '餐厅',
    categoryKPOP: 'K-POP',
    categoryENTERTAINMENT: '娱乐',
    categorySHOPPING: '购物',
    categoryCLUB: '俱乐部',
    categoryETC: '其他',
    
    // Types
    typeSTORE: '商店',
    typeEVENT: '活动',
    typePOPUP: '快闪',
    
    // Favorites page
    myFavorites: '我的收藏:',
    noFavorites: '暂无收藏',
    noFavoritesDesc: '试试给喜欢的商店或活动点个心吧！',
    favoriteLocation: '收藏位置',
    favoriteLocationDesc: '收藏的地点会显示在地图上',
    removeFromFavorites: '从收藏中移除',
    
    // Common
    loading: '加载中...',
    error: '发生错误',
    notFound: '页面未找到',
    like: '点赞',
    store: '商店',
    event: '活动',
    review: '评价',
    writeReview: '写我的评价（带评分系统）',
    photos: '相关照片'
  },
  
  es: {
    // Header
    categories: 'Categorías',
    events: 'Eventos',
    popup: 'Estación Pop-up de Esta Semana',
    bucketlist: 'Favoritos/Lista de Deseos',
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    
    // Homepage
    searchPlaceholder: 'Busca tiendas o eventos que desees',
    brandName: 'Lista KOKO',
    homeSubtitle: 'Eventos de Tiendas Personalizados para Tu Gusto',
    seeMore: 'Ver Más',
    
    // Category Selection Page
    categorySelection: 'Selección de Categoría',
    categoryDescription: 'Selecciona hasta 3 categorías de interés y te recomendaremos tiendas/eventos que coincidan con tu gusto',
    next: 'Siguiente',
    
    // Category Names
    cafe: 'Café',
    restaurant: 'Restaurante (Incluye Bares)',
    shopping: 'Compras',
    entertainment: 'Entretenimiento',
    kpop: 'K-POP',
    club: 'Club',
    etc: 'Otros',
    
    // Common
    loading: 'Cargando...',
    error: 'Ocurrió un error',
    notFound: 'Página no encontrada',
    like: 'Me gusta',
    store: 'Tienda',
    event: 'Evento',
    review: 'Reseña',
    writeReview: 'Escribir Mi Reseña (con Sistema de Calificación)',
    photos: 'Fotos Relacionadas'
  },
  
  fr: {
    // Header
    categories: 'Catégories',
    events: 'Événements',
    popup: 'Station Pop-up de Cette Semaine',
    bucketlist: 'Favoris/Liste de Souhaits',
    login: 'Se Connecter',
    logout: 'Se Déconnecter',
    
    // Homepage
    searchPlaceholder: 'Recherchez les magasins ou événements souhaités',
    brandName: 'Liste KOKO',
    homeSubtitle: 'Événements de Magasins Personnalisés pour Votre Goût',
    seeMore: 'Voir Plus',
    
    // Category Selection Page
    categorySelection: 'Sélection de Catégorie',
    categoryDescription: 'Sélectionnez jusqu\'à 3 catégories d\'intérêt et nous vous recommanderons des magasins/événements qui correspondent à votre goût',
    next: 'Suivant',
    
    // Category Names
    cafe: 'Café',
    restaurant: 'Restaurant (Y Compris Bars)',
    shopping: 'Shopping',
    entertainment: 'Divertissement',
    kpop: 'K-POP',
    club: 'Club',
    etc: 'Autres',
    
    // Common
    loading: 'Chargement...',
    error: 'Une erreur s\'est produite',
    notFound: 'Page non trouvée',
    like: 'J\'aime',
    store: 'Magasin',
    event: 'Événement',
    review: 'Avis',
    writeReview: 'Écrire Mon Avis (avec Système de Note)',
    photos: 'Photos Associées'
  }
};

// 현재 언어 상태 관리
let currentLanguage = 'ko';

// 언어 설정 함수
export const setCurrentLanguage = (language) => {
  currentLanguage = language;
  localStorage.setItem('selectedLanguage', language);
};

// 현재 언어 가져오기 함수
export const getCurrentLanguage = () => {
  const savedLanguage = localStorage.getItem('selectedLanguage');
  return savedLanguage || currentLanguage;
};

// 번역 함수
export const getTranslation = (key, language = getCurrentLanguage()) => {
  const lang = translations[language] || translations['ko'];
  return lang[key] || key;
};

// useTranslation 훅
export const useTranslation = () => {
  const [language, setLanguage] = React.useState(getCurrentLanguage());
  
  const t = React.useCallback((key) => {
    return getTranslation(key, language);
  }, [language]);
  
  const changeLanguage = React.useCallback((newLanguage) => {
    setCurrentLanguage(newLanguage);
    setLanguage(newLanguage);
  }, []);
  
  return { t, language, changeLanguage };
};