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
  const [showAiPreview, setShowAiPreview] = useState(false);
  const [aiPreviewResult, setAiPreviewResult] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

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

  // AI 미리보기 함수
  const handleAiPreview = async () => {
    if (!name.trim()) {
      alert('이벤트 이름을 먼저 입력해주세요.');
      return;
    }

    setIsAiLoading(true);
    setAiPreviewResult(null);
    setShowAiPreview(true);

    try {
      // ===== 현재 더미 AI 미리보기 버전 (실제 사용 중) =====
      console.log('AI 이벤트 미리보기 요청:', { name, description, intro });
      
      // 실제 API 호출을 시뮬레이션하기 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyResponse = {
        success: true,
        code: 200,
        message: "AI 이벤트 카피 미리보기 생성 성공",
        data: {
          intro: `${name}을(를) 위한 특별한 이벤트를 준비했습니다. ${description ? description + ' ' : ''}즐거운 시간을 보내세요!`,
          description: `${intro ? intro + ' ' : ''}특별한 혜택과 함께하는 이벤트입니다. 친구들과 함께 방문하시면 더욱 즐거운 시간을 보낼 수 있습니다. 많은 관심과 참여 부탁드립니다!`
        }
      };
      
      setAiPreviewResult(dummyResponse.data);
      
      // ===== 백엔드 배포 시 API 버전 (주석처리) =====
      /*
      const response = await ApiService.previewEventAi({
        name: name.trim(),
        description: description.trim() || undefined,
        intro: intro.trim() || undefined,
        thumbnail: thumbnail.trim() || undefined,
        images: images.filter(img => img.trim() !== '')
      });
      
      setAiPreviewResult(response.data);
      */
    } catch (error) {
      console.error('AI 미리보기 실패:', error);
      alert('AI 미리보기 생성에 실패했습니다.');
    } finally {
      setIsAiLoading(false);
    }
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
              <AiPreviewButton 
                type="button" 
                onClick={handleAiPreview}
                disabled={!name.trim() || isAiLoading}
              >
                {isAiLoading ? 'AI 생성 중...' : 'AI 홍보글 미리보기'}
              </AiPreviewButton>
              <Submit type="submit" disabled={disabled}>
                이벤트 등록하기
              </Submit>
            </SubmitBar>
          </Form>

          {/* AI 미리보기 결과 */}
          {showAiPreview && (
            <AiPreviewSection>
              <AiPreviewTitle>AI 홍보글 미리보기</AiPreviewTitle>
              
              {isAiLoading ? (
                <AiLoadingMessage>AI가 홍보글을 생성하고 있습니다...</AiLoadingMessage>
              ) : aiPreviewResult ? (
                <>
                  <AiPreviewCard>
                    <AiPreviewLabel>인트로 (요약/후킹)</AiPreviewLabel>
                    <AiPreviewContent>{aiPreviewResult.intro}</AiPreviewContent>
                  </AiPreviewCard>

                  <AiPreviewCard>
                    <AiPreviewLabel>상세 설명</AiPreviewLabel>
                    <AiPreviewContent>{aiPreviewResult.description}</AiPreviewContent>
                  </AiPreviewCard>

                  <AiActionButtons>
                    <AiCopyButton onClick={() => {
                      navigator.clipboard.writeText(`${aiPreviewResult.intro}\n\n${aiPreviewResult.description}`);
                      alert('홍보글이 클립보드에 복사되었습니다!');
                    }}>
                      전체 복사
                    </AiCopyButton>
                    <AiCloseButton onClick={() => {
                      setShowAiPreview(false);
                      setAiPreviewResult(null);
                    }}>
                      닫기
                    </AiCloseButton>
                  </AiActionButtons>
                </>
              ) : null}
            </AiPreviewSection>
          )}
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
  gap: 1rem;
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

// AI 미리보기 관련 스타일
const AiPreviewButton = styled.button`
  min-width: 180px;
  height: 48px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #4338ca;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const AiPreviewSection = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

const AiPreviewTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #262626;
  margin-bottom: 1.5rem;
`;

const AiLoadingMessage = styled.p`
  font-size: 1.4rem;
  color: #6b7280;
  text-align: center;
  padding: 2rem;
`;

const AiPreviewCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const AiPreviewLabel = styled.h4`
  font-size: 1.4rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.8rem;
`;

const AiPreviewContent = styled.p`
  font-size: 1.4rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
`;

const AiActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const AiCopyButton = styled.button`
  height: 44px;
  padding: 0 2rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #059669;
  }
`;

const AiCloseButton = styled.button`
  height: 44px;
  padding: 0 2rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #4b5563;
  }
`;