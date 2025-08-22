import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
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

function MerchantStoreEdit() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  // API 명세서의 StoreCreateRequest DTO 구조에 맞는 필드들
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState(''); // 전화번호 필드 추가
  const [intro, setIntro] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(''); // 썸네일 이미지 URL
  const [images, setImages] = useState(['']); // 추가 이미지 URL 배열
  const [startTime, setStartTime] = useState('10:00:00'); // 명세서에 맞게 필드명 변경
  const [endTime, setEndTime] = useState('22:00:00'); // 명세서에 맞게 필드명 변경

  // 필수 필드 검증 (명세서의 @NotBlank 필드들)
  const disabled = useMemo(() => 
    !name || !address || !number || !intro || !category || !thumbnail || !startTime || !endTime, 
    [name, address, number, intro, category, thumbnail, startTime, endTime]
  );

  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      // ===== 더미 데이터 버전 (주석처리) =====
      /*
      // TODO: API 연동
      // const response = await ApiService.getMyStores();
      // const storeData = response.data.find(store => store.id === parseInt(storeId));
      
      // 임시 더미 데이터 (명세서의 StoreCreateResponse DTO 구조에 맞춤)
      const storeData = {
        id: 12,
        ownerId: 5,
        name: '흥카페',
        address: '서울 마포구 서교동 123-45',
        number: '02-1234-5678',
        intro: '흥대의 감성을 담은 분위기 좋은 카페입니다.',
        category: 'CAFE',
        thumbnail: 'https://cdn.example.com/store/thumbnail.jpg',
        images: [
          'https://cdn.example.com/store/img1.jpg',
          'https://cdn.example.com/store/img2.jpg'
        ],
        startTime: '10:00:00',
        endTime: '22:00:00',
        like: 12
      };
      
      setName(storeData.name);
      setAddress(storeData.address);
      setNumber(storeData.number);
      setIntro(storeData.intro);
      setCategory(storeData.category);
      setThumbnail(storeData.thumbnail);
      setImages(storeData.images.length > 0 ? storeData.images : ['']);
      setStartTime(storeData.startTime);
      setEndTime(storeData.endTime);
      */
      
      // ===== 백엔드 API 버전 (활성화) =====
      
      try {
        const result = await storesAPI.getStore(storeId);
        
        if (result.success) {
          const storeData = result.data;
          setName(storeData.name);
          setAddress(storeData.address);
          setNumber(storeData.number);
          setIntro(storeData.intro);
          setCategory(storeData.category);
          setThumbnail(storeData.thumbnail);
          setImages(storeData.images.length > 0 ? storeData.images : ['']);
          setStartTime(storeData.startTime);
          setEndTime(storeData.endTime);
        } else {
          alert('가게 정보를 불러오는데 실패했습니다.');
          navigate('/mypage/stores');
        }
      } catch (error) {
        console.error('가게 정보 조회 실패:', error);
        alert('가게 정보를 불러오는데 실패했습니다.');
        navigate('/mypage/stores');
      }
    } catch (error) {
      console.error('Failed to fetch store data:', error);
      alert('가게 정보를 불러오는데 실패했습니다.');
      navigate('/mypage/stores');
    } finally {
      setLoading(false);
    }
  };

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

      // ===== 더미 수정 버전 (주석처리) =====
      /*
      console.log('가게 수정 데이터:', storeData);
      alert('가게 정보가 성공적으로 수정되었습니다!');
      navigate('/mypage/stores');
      */
      
      // ===== 백엔드 API 버전 (활성화) =====
      
      const response = await storesAPI.updateStore(storeId, storeData);
      console.log('가게 수정 성공:', response);
      alert('가게 정보가 성공적으로 수정되었습니다!');
      navigate('/mypage/stores');
      
    } catch (error) {
      console.error('Failed to update store:', error);
      alert('가게 정보 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <Page>
        <Header />
        <LoadingContainer>
          <LoadingText>가게 정보를 불러오는 중...</LoadingText>
        </LoadingContainer>
      </Page>
    );
  }

  return (
    <Page>
      <Header />
      <Main>
        <LeftPane>
          <PageTitle>가게 정보 수정</PageTitle>
          <PageDesc>가게 정보를 수정하여 최신 상태로 유지하세요!</PageDesc>
          <BackButton onClick={() => navigate('/mypage/stores')}>
            ← 가게 목록으로 돌아가기
          </BackButton>
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
              가게 정보 수정하기
            </SubmitButton>
          </Form>
        </RightPane>
      </Main>
    </Page>
  );
}

export default MerchantStoreEdit;

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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const LoadingText = styled.div`
  font-size: 1.6rem;
  color: #666;
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
  margin: 0 0 2rem 0;
`;

const BackButton = styled.button`
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    background: #e9ecef;
  }
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
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #dc2626;
  }
`;

const AddButton = styled.button`
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #4338ca;
  }
`;

const TimeInput = styled.input`
  height: 44px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 12px;
  outline: none;
  font-size: 14px;
  width: 100px; /* 시간 입력 필드 너비 고정 */
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