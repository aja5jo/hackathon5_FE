import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/common/Header';

const CATEGORIES = [
  { key: 'CAFE', label: '카페' },
  { key: 'CLUB', label: '클럽' },
  { key: 'SHOPPING', label: '쇼핑' },
  { key: 'ETC', label: '기타' },
  { key: 'FOOD', label: '음식점(술집)' },
  { key: 'K_POP', label: 'KPOP' },
  { key: 'ENTERTAINMENT', label: '오락' },
];

function MerchantEvent() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [openAt, setOpenAt] = useState('09:00');
  const [closeAt, setCloseAt] = useState('22:00');
  const [heroImage, setHeroImage] = useState(null);
  const [extraImage, setExtraImage] = useState(null);
  const [extraInfo, setExtraInfo] = useState('');
  const [intro, setIntro] = useState('');
  const [useAi, setUseAi] = useState(false);

  const disabled = useMemo(() => !name || !address || [name, address]);

  const onDropImage = (e, setter) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) setter(file);
  };

  const onChooseImage = (e, setter) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;

    // 폼 데이터 구성 (추후 API 연동 시 사용)
    const form = new FormData();
    form.append('name', name);
    form.append('address', address);
    form.append('openAt', openAt);
    form.append('closeAt', closeAt);
    form.append('extraInfo', extraInfo);
    form.append('intro', intro);
    form.append('useAi', String(useAi));
    if (heroImage) form.append('heroImage', heroImage);
    if (extraImage) form.append('extraImage', extraImage);

    alert('이벤트 등록 폼이 준비되었습니다. (API 연동 시 전송)');
  };

  return (
    <Page>
      <Header />
      <Main>
        <LeftPane>
          <PageTitle>이벤트 등록하기</PageTitle>
          <PageDesc>이벤트를 등록하면 홍보가 가능합니다!</PageDesc>
        </LeftPane>

        <RightPane>
          <Form onSubmit={handleSubmit}>
            {/* 가게 이름 */}
            <Field>
              <Label>
                이벤트 이름 <Required>*</Required>
              </Label>
              <Input
                placeholder="이벤트 이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            {/* 주소 */}
            <Field>
              <Label>
                이벤트 장소 <Required>*</Required>
              </Label>
              <Input
                placeholder="주소 또는 위치를 입력해주세요"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
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
              <Label>이벤트 이미지</Label>
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
                placeholder="동물 동반 가능 여부, 주차 가능 여부 등 추가 정보를 입력해주세요"
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
              />
            </Field>

            {/* 소개 */}
            <Field>
              <Label>이벤트 소개</Label>
              <Textarea
                rows={3}
                placeholder="이벤트에 대한 소개를 작성해주세요"
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
                이벤트 등록하기
              </Submit>
            </SubmitBar>
          </Form>
        </RightPane>
      </Main>
    </Page>
  );
}

export default MerchantEvent;

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