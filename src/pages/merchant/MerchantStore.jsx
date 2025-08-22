import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/common/Header';
import { validateStoreData, sanitizeInput } from '../../utils/validation';
import { storesAPI } from '../../services/api'

const CATEGORIES = [
  { key: 'CAFE', label: '카페' },
  { key: 'CLUB', label: '클럽' },
  { key: 'SHOPPING', label: '쇼핑' },
  { key: 'ETC', label: '기타' },
  { key: 'FOOD', label: '음식점(술집)' },
  { key: 'K_POP', label: 'KPOP' },
  { key: 'ENTERTAINMENT', label: '오락' },
];

function MerchantStore() {
  // API 명세서의 StoreCreateRequest DTO 구조에 맞는 필드들
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState(''); // 전화번호 필드 추가
  const [intro, setIntro] = useState('');
  const [category, setCategory] = useState(''); // 단일 선택
  const [thumbnail, setThumbnail] = useState(''); // 썸네일 이미지 URL
  const [images, setImages] = useState(['']); // 추가 이미지 URL 배열
  const [startTime, setStartTime] = useState('10:00:00'); // 명세서에 맞게 필드명 변경
  const [endTime, setEndTime] = useState('22:00:00'); // 명세서에 맞게 필드명 변경

  // 필수 필드 검증 (명세서의 @NotBlank 필드들)
  const disabled = useMemo(() => 
    !name || !address || !number || !intro || !category || !thumbnail || !startTime || !endTime, 
    [name, address, number, intro, category, thumbnail, startTime, endTime]
  );

  // 추가 이미지 URL 추가
  const addImageUrl = () => {
    setImages([...images, '']);
  };

  // 추가 이미지 URL 제거
  const removeImageUrl = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // 추가 이미지 URL 변경
  const updateImageUrl = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    try {
      // API 명세서의 StoreCreateRequest DTO 구조에 맞게 데이터 구성
      const storeData = {
        name: name.trim(),
        address: address.trim(),
        number: number.trim(),
        intro: intro.trim(),
        category: category,
        thumbnail: thumbnail.trim(),
        images: images.filter(img => img.trim() !== ''), // 빈 URL 제거
        startTime: startTime,
        endTime: endTime
      };

      // 데이터 검증
      const validation = validateStoreData(storeData);
      if (!validation.isValid) {
        alert(`입력 데이터 오류:\n${validation.errors.join('\n')}`);
        return;
      }

      // 데이터 정제
      const sanitizedData = sanitizeInput(storeData);

      // ===== 더미 등록 버전 (주석처리) =====
      /*
      console.log('가게 등록 데이터:', storeData);
      alert('가게가 성공적으로 등록되었습니다!');
      // 성공 시 가게 목록으로 이동
      window.location.href = '/mypage/stores';
      */
      
      // ===== 백엔드 API 버전 (활성화) =====
      
      const response = await storesAPI.createStore(storeData);
      console.log('가게 등록 성공:', response);
      alert('가게가 성공적으로 등록되었습니다!');
      // 성공 시 가게 목록으로 이동
      window.location.href = '/mypage/stores';
      
    } catch (error) {
      console.error('Failed to create store:', error);
      alert('가게 등록에 실패했습니다. 다시 시도해주세요.');
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
                가게 주소 <Required>*</Required>
              </Label>
              <Input
                placeholder="주소를 입력해주세요"
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
                placeholder="전화번호를 입력해주세요 (예: 02-1234-5678)"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Field>

            {/* 가게 소개 */}
            <Field>
              <Label>
                가게 소개 <Required>*</Required>
              </Label>
              <Textarea
                rows={3}
                placeholder="가게에 대한 소개를 입력해주세요"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
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
                  <CategoryButton
                    type="button"
                    key={c.key}
                    selected={category === c.key}
                    onClick={() => setCategory(c.key)}
                  >
                    {c.label}
                  </CategoryButton>
                ))}
              </CategoryGrid>
            </Field>

            {/* 썸네일 이미지 */}
            <Field>
              <Label>
                썸네일 이미지 <Required>*</Required>
              </Label>
              <Input
                placeholder="썸네일 이미지 URL을 입력해주세요"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
              />
            </Field>

            {/* 추가 이미지들 */}
            <Field>
              <Label>추가 이미지들</Label>
              <Helper>선택사항입니다. 빈 URL은 자동으로 제외됩니다.</Helper>
              {images.map((imageUrl, index) => (
                <ImageUrlRow key={index}>
                  <Input
                    placeholder={`추가 이미지 ${index + 1} URL을 입력해주세요`}
                    value={imageUrl}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                  />
                  {images.length > 1 && (
                    <RemoveButton type="button" onClick={() => removeImageUrl(index)}>
                      삭제
                    </RemoveButton>
                  )}
                </ImageUrlRow>
              ))}
              <AddButton type="button" onClick={addImageUrl}>
                + 이미지 추가
              </AddButton>
            </Field>

            {/* 운영시간 */}
            <Field>
              <Label>
                운영시간 <Required>*</Required>
              </Label>
              <TimeRow>
                <TimeInput
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value + ':00')}
                />
                <Dash>~</Dash>
                <TimeInput
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value + ':00')}
                />
              </TimeRow>
            </Field>

            {/* 제출 버튼 */}
            <SubmitButton type="submit" disabled={disabled}>
              가게 등록하기
            </SubmitButton>
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

  &:hover {
    border-color: #fee502;
    transform: translateY(-1px);
  }
`;

const UploadRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Dropzone = styled.label`
  position: relative;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  min-height: 140px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    background: #f7f7f7;
  }
`;

const HiddenFile = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
`;

const UploadIcon = styled.div`
  font-size: 22px;
`;

const UploadTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const UploadSub = styled.div`
  font-size: 11px;
  color: #9ca3af;
`;

const Preview = styled.div`
  position: absolute;
  bottom: 10px;
  left: 12px;
  right: 12px;
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

const ImageUrlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const RemoveButton = styled.button`
  height: 32px;
  padding: 0 10px;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: #dc2626;
  }
`;

const AddButton = styled.button`
  height: 42px;
  background: #e5e7eb;
  color: #222;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.16s ease;

  &:hover {
    background: #d1d5db;
    transform: translateY(-1px);
  }
`;

const TimeInput = styled.input`
  height: 44px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 12px;
  outline: none;
  font-size: 14px;
  width: 100px; /* 시간 입력 필드 너비 조정 */
`;

const SubmitButton = styled.button`
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