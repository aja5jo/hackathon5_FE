import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/common/Header';
// import ApiService from '../../utils/apiService'; // 백엔드 배포 시 사용

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
  const [description, setDescription] = useState('');
  const [intro, setIntro] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [images, setImages] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('10:00:00');
  const [endTime, setEndTime] = useState('20:00:00');
  const [isPopup, setIsPopup] = useState(false);

  const disabled = useMemo(() => !name || !description || !intro || !thumbnail || !startDate || !endDate, [name, description, intro, thumbnail, startDate, endDate]);

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
      // ===== 현재 더미 등록 버전 (실제 사용 중) =====
      // 더미 이벤트 등록 성공 처리
      alert('이벤트가 성공적으로 등록되었습니다!');
      // 성공 시 이벤트 목록으로 이동
      window.location.href = '/mypage/events';
      
      // ===== 백엔드 배포 시 API 버전 (주석처리) =====
      /*
      // API 명세서에 맞는 요청 데이터 구성
      const eventData = {
        name: name.trim(),
        description: description.trim(),
        intro: intro.trim(),
        thumbnail: thumbnail.trim(),
        images: images.filter(img => img.trim() !== ''),
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        isPopup: isPopup
      };

      // API 명세서에 맞는 이벤트 등록 요청
      const response = await fetch('http://localhost:8080/api/merchants/stores/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 기반 인증
        body: JSON.stringify(eventData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('이벤트 등록 성공:', result.message);
        alert('이벤트가 성공적으로 등록되었습니다!');
        // 성공 시 이벤트 목록으로 이동
        window.location.href = '/mypage/events';
      } else {
        // API 명세서에 따른 에러 메시지 처리
        if (result.code === 401) {
          alert('로그인이 필요합니다.');
          window.location.href = '/login';
        } else if (result.code === 403) {
          alert('등록된 가게가 없는 사용자입니다.');
        } else if (result.code === 400) {
          alert(result.message || '이벤트 등록에 실패했습니다.');
        } else {
          alert(result.message || '이벤트 등록 중 오류가 발생했습니다.');
        }
      }
      */
      
      // ===== ApiService 사용 버전 (백엔드 배포 시 사용) =====
      /*
      try {
        const eventData = {
          name: name.trim(),
          description: description.trim(),
          intro: intro.trim(),
          thumbnail: thumbnail.trim(),
          images: images.filter(img => img.trim() !== ''),
          startDate: startDate,
          endDate: endDate,
          startTime: startTime,
          endTime: endTime,
          isPopup: isPopup
        };

        const result = await ApiService.createMerchantEvent(eventData);
        
        if (result.success) {
          console.log('이벤트 등록 성공:', result.message);
          alert('이벤트가 성공적으로 등록되었습니다!');
          window.location.href = '/mypage/events';
        } else {
          // API 명세서에 따른 에러 메시지 처리
          if (result.code === 401) {
            alert('로그인이 필요합니다.');
            window.location.href = '/login';
          } else if (result.code === 403) {
            alert('등록된 가게가 없는 사용자입니다.');
          } else if (result.code === 400) {
            alert(result.message || '이벤트 등록에 실패했습니다.');
          } else {
            alert(result.message || '이벤트 등록 중 오류가 발생했습니다.');
          }
        }
      } catch (error) {
        console.error('이벤트 등록 API 오류:', error);
        alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
      }
      */
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('이벤트 등록에 실패했습니다. 다시 시도해주세요.');
    }
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
            {/* 이벤트 이름 */}
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

            {/* 이벤트 대표 소개글 */}
            <Field>
              <Label>
                이벤트 대표 소개글 <Required>*</Required>
              </Label>
              <Input
                placeholder="이벤트에 대한 간단한 소개글을 입력해주세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            {/* 이벤트 기간 */}
            <Field>
              <Label>
                이벤트 기간 <Required>*</Required>
              </Label>
              <TimeRow>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Dash>~</Dash>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </TimeRow>
            </Field>

            {/* 이벤트 시간 */}
            <Field>
              <Label>
                이벤트 시간 <Required>*</Required>
              </Label>
              <TimeRow>
                <Select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                  {timeOptions.map((t) => (
                    <option key={`s-${t}`} value={`${t}:00`}>
                      {t}
                    </option>
                  ))}
                </Select>
                <Dash>~</Dash>
                <Select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                  {timeOptions.map((t) => (
                    <option key={`e-${t}`} value={`${t}:00`}>
                      {t}
                    </option>
                  ))}
                </Select>
              </TimeRow>
            </Field>

            {/* 썸네일 이미지 */}
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

            {/* 이벤트 상세 설명 */}
            <Field>
              <Label>
                이벤트 상세 설명 <Required>*</Required>
              </Label>
              <Textarea
                rows={5}
                placeholder="이벤트에 대한 상세한 설명을 작성해주세요"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
              />
            </Field>

            {/* 팝업 여부 */}
            <Field>
              <Label>
                팝업 여부 <Required>*</Required>
              </Label>
              <RadioRow>
                <RadioLabel>
                  <input
                    type="radio"
                    name="isPopup"
                    checked={isPopup === true}
                    onChange={() => setIsPopup(true)}
                  />
                  <span>팝업</span>
                </RadioLabel>
                <RadioLabel>
                  <input
                    type="radio"
                    name="isPopup"
                    checked={isPopup === false}
                    onChange={() => setIsPopup(false)}
                  />
                  <span>일반 이벤트</span>
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