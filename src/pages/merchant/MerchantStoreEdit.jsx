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
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [openAt, setOpenAt] = useState('09:00');
  const [closeAt, setCloseAt] = useState('22:00');
  const [heroImage, setHeroImage] = useState(null);
  const [extraImage, setExtraImage] = useState(null);
  const [extraInfo, setExtraInfo] = useState('');
  const [intro, setIntro] = useState('');
  const [useAi, setUseAi] = useState(false);

  const disabled = useMemo(() => !name || !address || !category, [name, address, category]);

  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      // TODO: API 연동
      // const response = await ApiService.getStore(storeId);
      
      // 임시 더미 데이터
      const storeData = {
        name: '카페 모모',
        address: '서울시 마포구 홍대입구역 123-45',
        category: 'CAFE',
        openAt: '09:00',
        closeAt: '22:00',
        extraInfo: '룸 가능, 금연',
        intro: '홍대의 아늑한 카페입니다.',
        useAi: true
      };
      
      setName(storeData.name);
      setAddress(storeData.address);
      setCategory(storeData.category);
      setOpenAt(storeData.openAt);
      setCloseAt(storeData.closeAt);
      setExtraInfo(storeData.extraInfo);
      setIntro(storeData.intro);
      setUseAi(storeData.useAi);
    } catch (error) {
      console.error('Failed to fetch store data:', error);
      alert('가게 정보를 불러오는데 실패했습니다.');
      navigate('/mypage/stores');
    } finally {
      setLoading(false);
    }
  };

  const onDropImage = (e, setter) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) setter(file);
  };

  const onChooseImage = (e, setter) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    try {
      const form = new FormData();
      form.append('name', name);
      form.append('address', address);
      form.append('category', category);
      form.append('openAt', openAt);
      form.append('closeAt', closeAt);
      form.append('extraInfo', extraInfo);
      form.append('intro', intro);
      form.append('useAi', String(useAi));
      if (heroImage) form.append('heroImage', heroImage);
      if (extraImage) form.append('extraImage', extraImage);

      await storesAPI.updateStore(storeId, form);
      alert('가게 정보가 수정되었습니다.');
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
                가게 장소 <Required>*</Required>
              </Label>
              <Input
                placeholder="주소 또는 위치를 입력해주세요"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
              <Label>가게 이미지</Label>
              <UploadRow>
                <Dropzone
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDropImage(e, setHeroImage)}
                >
                  <UploadIcon>📷</UploadIcon>
                  <UploadTitle>대표 사진 업로드</UploadTitle>
                  <UploadSub>1장 필수 (최대 5MB)</UploadSub>
                  <HiddenFile
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChooseImage(e, setHeroImage)}
                  />
                  {heroImage && <Preview>{heroImage.name}</Preview>}
                </Dropzone>
                <Dropzone
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDropImage(e, setExtraImage)}
                >
                  <UploadIcon>📷</UploadIcon>
                  <UploadTitle>추가 사진 업로드</UploadTitle>
                  <UploadSub>최소 0장 최대 5장</UploadSub>
                  <HiddenFile
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChooseImage(e, setExtraImage)}
                  />
                  {extraImage && <Preview>{extraImage.name}</Preview>}
                </Dropzone>
              </UploadRow>
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
              <Label>가게 소개</Label>
              <Textarea
                rows={3}
                placeholder="가게에 대한 소개를 작성해주세요"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
              />
            </Field>

            {/* AI 추천 */}
            <Field>
              <Label>AI 추천을 받으시겠습니까?</Label>
              <RadioRow>
                <RadioLabel>
                  <input
                    type="radio"
                    name="useAi"
                    checked={useAi === true}
                    onChange={() => setUseAi(true)}
                  />
                  <span>예</span>
                </RadioLabel>
                <RadioLabel>
                  <input
                    type="radio"
                    name="useAi"
                    checked={useAi === false}
                    onChange={() => setUseAi(false)}
                  />
                  <span>아니오</span>
                </RadioLabel>
              </RadioRow>
            </Field>

            <SubmitBar>
              <Submit type="submit" disabled={disabled}>
                가게 정보 수정하기
              </Submit>
            </SubmitBar>
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