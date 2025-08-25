import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { storesAPI } from '../../services/api';

const CATEGORIES = [
  { key: 'CAFE', label: '카페' },
  { key: 'CLUB', label: '클럽' },
  { key: 'SHOPPING', label: '쇼핑' },
  { key: 'OTHER', label: '기타' },
  { key: 'RESTAURANT', label: '음식점(술집)' },
  { key: 'KPOP', label: 'KPOP' },
  { key: 'ENTERTAINMENT', label: '오락' },
];

function MerchantStore() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [category, setCategory] = useState('CAFE'); // 기본값 설정
  const [openAt, setOpenAt] = useState('09:00');
  const [closeAt, setCloseAt] = useState('22:00');
  const [thumbnail, setThumbnail] = useState(''); // URL 입력 방식으로 변경
  const [images, setImages] = useState([]); // 추가 이미지들 URL 배열
  const [extraInfo, setExtraInfo] = useState('');
  const [intro, setIntro] = useState('');
  // AI 추천 필드는 API 명세서에 없으므로 제거
  const [hasExistingStore, setHasExistingStore] = useState(false);

  const disabled = useMemo(() => !name || !address || !number || !category || !thumbnail || !intro, [name, address, number, category, thumbnail, intro]);

  // 디버깅용: 카테고리 상태 확인
  useEffect(() => {
    console.log('현재 선택된 카테고리:', category);
  }, [category]);

  // 컴포넌트 마운트 시 기존 가게 확인
  useEffect(() => {
    // localStorage 상태 확인 (디버깅용)
    console.log('=== MerchantStore localStorage 상태 확인 ===');
    console.log('localStorage user:', localStorage.getItem('user'));
    console.log('localStorage userType:', localStorage.getItem('userType'));
    console.log('localStorage 전체:', Object.keys(localStorage));
    console.log('==========================================');
    
    checkExistingStore();
  }, []);

  const checkExistingStore = async () => {
    try {
      const response = await storesAPI.getMyStores();
      console.log('가게 상태 확인 API 응답:', response);
      
      // API 응답 구조 확인: data가 배열인지 단일 객체인지 확인
      const hasExistingStore = response.success && response.data && (
        Array.isArray(response.data) ? response.data.length > 0 : 
        typeof response.data === 'object' && response.data.id
      );
      
      console.log('기존 가게 존재 여부 판단:', {
        success: response.success,
        hasData: !!response.data,
        isArray: Array.isArray(response.data),
        isObject: typeof response.data === 'object',
        hasId: response.data?.id,
        dataType: typeof response.data,
        hasExistingStore: hasExistingStore
      });
      
      if (hasExistingStore) {
        setHasExistingStore(true);
        alert('이미 등록된 가게가 있습니다. 소상공은 가게를 하나만 등록할 수 있습니다.');
        window.location.href = '/mypage/stores';
      }
    } catch (error) {
      console.error('기존 가게 확인 실패:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 인증 상태 확인 (디버깅용)
    const user = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    console.log('=== 가게 등록 시도 - 인증 상태 확인 ===');
    console.log('localStorage user:', user);
    console.log('localStorage userType:', userType);
    console.log('localStorage 전체 키:', Object.keys(localStorage));
    console.log('==========================================');
    
    // 추가 유효성 검사
    if (!category || category === '') {
      alert('카테고리를 선택해주세요.');
      return;
    }
    
    if (disabled) return;

    try {
      console.log('폼 제출 시작');
      console.log('현재 카테고리 상태:', category);
      console.log('썸네일 URL:', thumbnail);
      console.log('추가 이미지들:', images);

      // 폼 데이터 구성 (API 명세서에 맞게 필드명 수정)
      const formData = {
        name: name.trim(),
        address: address.trim(),
        number: number.trim(),
        category: category,
        startTime: `${openAt}:00`, // HH:mm:ss 형식으로 변경
        endTime: `${closeAt}:00`, // HH:mm:ss 형식으로 변경
        intro: intro.trim(),
        thumbnail: thumbnail.trim(),
        images: images.filter(img => img.trim() !== '') // 빈 문자열 제거
      };

      console.log('=== API 요청 데이터 상세 ===');
      console.log('name:', formData.name);
      console.log('address:', formData.address);
      console.log('number:', formData.number);
      console.log('category:', formData.category);
      console.log('startTime:', formData.startTime);
      console.log('endTime:', formData.endTime);
      console.log('intro:', formData.intro);
      console.log('thumbnail:', formData.thumbnail);
      console.log('images:', formData.images);
      console.log('전체 formData:', JSON.stringify(formData, null, 2));
      console.log('==========================');

      // API 연동
      console.log('storesAPI.createStore 호출 시작');
      const result = await storesAPI.createStore(formData);
      console.log('API 응답:', result);
      
      if (result.success) {
        alert('가게가 성공적으로 등록되었습니다!');
        // 성공 시 홈으로 이동
        window.location.href = '/';
      } else {
        console.log('API 오류 응답:', result);
        // API 명세서에 따른 에러 메시지 처리
        if (result.code === 401) {
          alert('로그인이 필요합니다.');
          window.location.href = '/login';
        } else if (result.code === 403) {
          alert('접근 권한이 없습니다.');
        } else if (result.code === 400) {
          alert(result.message || '가게 등록에 실패했습니다.');
        } else {
          alert(result.message || '가게 등록 중 오류가 발생했습니다.');
        }
      }
    } catch (error) {
      console.error('Failed to create store:', error);
      
      // 에러 메시지 처리
      if (error.message.includes('인증이 필요합니다')) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      } else if (error.message.includes('서버 오류')) {
        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.message.includes('접근 권한이 없습니다')) {
        alert('접근 권한이 없습니다.');
      } else {
        alert('가게 등록에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <Page>
      <Header />
      <Main>
        <LeftPane>
          <PageTitle>가게 등록하기</PageTitle>
          <PageDesc>가게를 등록하면 가게 및 이벤트 홍보가 가능합니다!</PageDesc>
        </LeftPane>

        <RightPane>
          <Form onSubmit={handleSubmit}>
            {/* 가게 이름 */}
            <Field>
              <Label>
                가게 이름 <Required>*</Required>
              </Label>
              <Input
                placeholder="가게 이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            {/* 주소 */}
            <Field>
              <Label>
                가게 장소 <Required>*</Required>
              </Label>
              <Input
                placeholder="주소 또는 위치를 입력해주세요"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Field>

            {/* 전화번호 */}
            <Field>
              <Label>
                전화번호 <Required>*</Required>
              </Label>
              <Input
                type="tel"
                placeholder="가게 전화번호를 입력해주세요 (예: 02-1234-5678)"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Field>

            {/* 카테고리 */}
            <Field>
              <Label>
                가게 카테고리 선택 <Required>*</Required>
              </Label>
              <Helper>하나의 카테고리만 선택 가능합니다</Helper>
                             <CategoryGrid>
                 {CATEGORIES.map((c) => (
                   <button
                     key={c.key}
                     type="button"
                                           onClick={() => {
                        console.log('카테고리 클릭됨!', c.key, c.label);
                        setCategory(c.key);
                        console.log('카테고리 상태 업데이트:', c.key);
                      }}
                                           style={{
                        height: '42px',
                        borderRadius: '10px',
                        border: `1.5px solid ${category === c.key ? '#fee502' : '#e5e7eb'}`,
                        background: category === c.key ? '#fff9c4' : '#fff',
                        color: '#222',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                      }}
                   >
                     {c.label}
                   </button>
                 ))}
               </CategoryGrid>
            </Field>

            {/* 운영시간 */}
            <Field>
              <Label>
                운영시간 <Required>*</Required>
              </Label>
              <TimeRow>
                <Select value={openAt} onChange={(e) => setOpenAt(e.target.value)}>
                  {timeOptions.map((t) => (
                    <option key={`o-${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
                <Dash>~</Dash>
                <Select value={closeAt} onChange={(e) => setCloseAt(e.target.value)}>
                  {timeOptions.map((t) => (
                    <option key={`c-${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </TimeRow>
            </Field>

            {/* 이미지 업로드 */}
            <Field>
              <Label>
                썸네일 이미지 <Required>*</Required>
              </Label>
              <Input
                type="url"
                placeholder="썸네일 이미지 URL을 입력해주세요"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
              />
            </Field>

            {/* 추가 이미지들 */}
            <Field>
              <Label>추가 이미지들</Label>
              <Input
                type="url"
                placeholder="추가 이미지 URL을 입력해주세요 (선택사항)"
                value={images.join(', ')}
                onChange={(e) => setImages(e.target.value.split(',').map(url => url.trim()).filter(url => url !== ''))}
              />
              <Helper>여러 이미지는 쉼표(,)로 구분해주세요</Helper>
            </Field>

            {/* 기타 정보 */}
            <Field>
              <Label>기타 정보</Label>
              <Textarea
                rows={3}
                placeholder="룸/흡연 가능 여부, 유아 가능 여부 등 추가 정보를 입력해주세요"
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
              />
            </Field>

            {/* 소개 */}
            <Field>
              <Label>
                가게 소개 <Required>*</Required>
              </Label>
              <Textarea
                rows={3}
                placeholder="가게에 대한 소개를 작성해주세요"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
              />
            </Field>

            {/* AI 추천 필드는 API 명세서에 없으므로 제거 */}

            <SubmitBar>
              <Submit type="submit" disabled={disabled}>
                가게 등록하기
              </Submit>
            </SubmitBar>
          </Form>
        </RightPane>
      </Main>
    </Page>
  );
}

export default MerchantStore;

// ===== util =====
const timeOptions = Array.from({ length: 24 }, (_, h) => {
  const hh = h.toString().padStart(2, '0');
  return [`${hh}:00`, `${hh}:30`];
})
  .flat()
  .filter((_, i) => i % 1 === 0);

// ===== styles =====
const Page = styled.div`
  min-height: 100vh;
  background: #fff;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 48px 16px;
  display: grid;
  grid-template-columns: 1.2fr 1.8fr;
  gap: 24px;
  margin-top: 64px; /* header height */

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPane = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 24px 8px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #222;
  margin: 0 0 12px 0;
`;

const PageDesc = styled.p`
  color: #6b7280;
  margin: 0;
`;

const RightPane = styled.div`
  background: #fff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #2b2b2b;
`;

const Required = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

const Helper = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

const Input = styled.input`
  height: 44px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 12px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #fee502;
  }
`;

const Select = styled.select`
  height: 44px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 12px;
  outline: none;
  font-size: 14px;
`;

const TimeRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Dash = styled.span`
  color: #6b7280;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  pointer-events: auto;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const CategoryButton = styled.button`
  height: 42px;
  border-radius: 10px;
  border: 1.5px solid ${p => (p.selected ? '#fee502' : '#e5e7eb')};
  background: ${p => (p.selected ? '#fff9c4' : '#fff')};
  color: #222;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.16s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: auto;
  position: relative;
  z-index: 1;

  &:hover {
    border-color: #fee502;
    transform: translateY(-1px);
    background: ${p => (p.selected ? '#fff9c4' : '#f9f9f9')};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: 2px solid #fee502;
    outline-offset: 2px;
  }
`;

const Textarea = styled.textarea`
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  outline: none;
  font-size: 14px;
  resize: vertical;
  min-height: 90px;
  transition: border-color 0.15s ease;
  &:focus { border-color: #fee502; }
`;

const RadioRow = styled.div`
  display: flex;
  gap: 12px;

  input { margin-right: 6px; }
`;
const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 9999px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  color: #222;
  user-select: none;
  transition: border-color 0.15s ease, background-color 0.15s ease, transform 0.1s ease;

  &:hover {
    border-color: #fee502;
    transform: translateY(-1px);
  }

  input {
    accent-color: #fee502;
  }
`;

const SubmitBar = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4px;
`;

const Submit = styled.button`
  min-width: 220px;
  height: 48px;
  background: #fee502;
  color: #262626;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .12s ease, background-color .2s ease;
  &:hover { background: #ffe44b; transform: translateY(-1px); }
  &:disabled { opacity: .6; cursor: not-allowed; }
`;