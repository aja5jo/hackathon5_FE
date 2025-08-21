// ===== API 명세서 기반 검증 유틸리티 =====

/**
 * 날짜/시간 교차 검증 (API 명세서 규칙)
 * - startDate ≤ endDate
 * - 같은 날인 경우 startTime < endTime
 */
export const validateDateTime = (startDate, endDate, startTime, endTime) => {
  const errors = [];

  // 날짜 검증
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      errors.push("시작일은 종료일보다 이전이어야 합니다.");
    }
  }

  // 시간 검증 (같은 날인 경우)
  if (startDate && endDate && startDate === endDate && startTime && endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (start >= end) {
      errors.push("같은 날인 경우 시작 시간은 종료 시간보다 이전이어야 합니다.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 팝업 데이터 검증 (PopupCreateRequest DTO 규칙)
 */
export const validatePopupData = (popupData) => {
  const errors = [];

  // 필수 필드 검증
  if (!popupData.category) {
    errors.push("카테고리는 필수입니다.");
  }

  if (!popupData.name?.trim()) {
    errors.push("팝업 이름은 필수입니다.");
  }

  if (!popupData.description?.trim()) {
    errors.push("대표 소개글은 필수입니다.");
  }

  if (!popupData.thumbnail?.trim()) {
    errors.push("썸네일은 필수입니다.");
  }

  if (!popupData.address?.trim()) {
    errors.push("주소는 필수입니다.");
  }

  if (!popupData.startDate) {
    errors.push("시작일은 필수입니다.");
  }

  if (!popupData.endDate) {
    errors.push("종료일은 필수입니다.");
  }

  if (!popupData.startTime) {
    errors.push("시작 시간은 필수입니다.");
  }

  if (!popupData.endTime) {
    errors.push("종료 시간은 필수입니다.");
  }

  // 날짜/시간 교차 검증
  if (popupData.startDate && popupData.endDate && popupData.startTime && popupData.endTime) {
    const dateTimeValidation = validateDateTime(
      popupData.startDate,
      popupData.endDate,
      popupData.startTime,
      popupData.endTime
    );
    errors.push(...dateTimeValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 가게 데이터 검증 (StoreCreateRequest DTO 규칙)
 */
export const validateStoreData = (storeData) => {
  const errors = [];

  // 필수 필드 검증
  if (!storeData.name?.trim()) {
    errors.push("가게 이름은 필수입니다.");
  }

  if (!storeData.address?.trim()) {
    errors.push("주소는 필수입니다.");
  }

  if (!storeData.category) {
    errors.push("카테고리는 필수입니다.");
  }

  if (!storeData.thumbnail?.trim()) {
    errors.push("썸네일은 필수입니다.");
  }

  if (!storeData.startTime) {
    errors.push("시작 시간은 필수입니다.");
  }

  if (!storeData.endTime) {
    errors.push("종료 시간은 필수입니다.");
  }

  // 시간 검증
  if (storeData.startTime && storeData.endTime) {
    const start = new Date(`2000-01-01T${storeData.startTime}`);
    const end = new Date(`2000-01-01T${storeData.endTime}`);
    
    if (start >= end) {
      errors.push("시작 시간은 종료 시간보다 이전이어야 합니다.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 이벤트 데이터 검증
 */
export const validateEventData = (eventData) => {
  const errors = [];

  // 필수 필드 검증
  if (!eventData.name?.trim()) {
    errors.push("이벤트 이름은 필수입니다.");
  }

  if (!eventData.description?.trim()) {
    errors.push("이벤트 설명은 필수입니다.");
  }

  if (!eventData.startDate) {
    errors.push("시작일은 필수입니다.");
  }

  if (!eventData.endDate) {
    errors.push("종료일은 필수입니다.");
  }

  if (!eventData.startTime) {
    errors.push("시작 시간은 필수입니다.");
  }

  if (!eventData.endTime) {
    errors.push("종료 시간은 필수입니다.");
  }

  // 날짜/시간 교차 검증
  if (eventData.startDate && eventData.endDate && eventData.startTime && eventData.endTime) {
    const dateTimeValidation = validateDateTime(
      eventData.startDate,
      eventData.endDate,
      eventData.startTime,
      eventData.endTime
    );
    errors.push(...dateTimeValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 이미지 URL 검증
 */
export const validateImageUrls = (urls) => {
  const errors = [];
  
  if (!Array.isArray(urls)) {
    errors.push("이미지 URL은 배열 형태여야 합니다.");
    return { isValid: false, errors };
  }

  urls.forEach((url, index) => {
    if (url && typeof url === 'string') {
      try {
        new URL(url);
      } catch {
        errors.push(`이미지 URL ${index + 1}이 유효하지 않습니다.`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 응답 데이터 검증 (PopupCreateResponse, StoreCreateResponse 등)
 */
export const validateResponseData = (data, type = 'popup') => {
  const errors = [];
  const requiredFields = ['id', 'name', 'address', 'category'];

  // 기본 필수 필드 검증
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`응답 데이터에 필수 필드 '${field}'가 없습니다.`);
    }
  }

  // 타입별 추가 검증
  if (type === 'popup') {
    const popupFields = ['description', 'thumbnail', 'startDate', 'endDate', 'startTime', 'endTime'];
    for (const field of popupFields) {
      if (!(field in data)) {
        errors.push(`팝업 응답 데이터에 필수 필드 '${field}'가 없습니다.`);
      }
    }
  } else if (type === 'store') {
    const storeFields = ['thumbnail', 'startTime', 'endTime'];
    for (const field of storeFields) {
      if (!(field in data)) {
        errors.push(`가게 응답 데이터에 필수 필드 '${field}'가 없습니다.`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 사용자 입력 데이터 정제 (trim, 빈 값 제거 등)
 */
export const sanitizeInput = (data) => {
  const sanitized = { ...data };

  // 문자열 필드 정제
  const stringFields = ['name', 'description', 'intro', 'address', 'thumbnail'];
  stringFields.forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitized[field].trim();
    }
  });

  // 이미지 배열 정제
  if (Array.isArray(sanitized.images)) {
    sanitized.images = sanitized.images.filter(img => img && img.trim() !== '');
  }

  return sanitized;
};
