import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import { storesAPI } from '../../services/api'

function MerchantEventEdit() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const disabled = useMemo(() => !name || !description || !intro || !thumbnail || !startDate || !endDate, [name, description, intro, thumbnail, startDate, endDate]);

  // 이벤트 데이터 로드
  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      
      // ===== 더미 데이터 버전 (주석처리) =====
      /*
      // 더미 이벤트 데이터 (API 명세서 구조에 맞춤)
      const dummyEvent = {
        id: parseInt(eventId),
        storeId: 10,
        name: '아이스 아메리카노 1+1 이벤트',
        description: '무더운 여름, 시원한 이벤트!',
        intro: '흥카페에서 여름을 맞아 아이스 음료 1+1 이벤트를 진행합니다. 많은 방문 부탁드립니다.',
        thumbnail: 'https://cdn.example.com/event/thumb.jpg',
        images: ['https://cdn.example.com/event/img1.jpg', 'https://cdn.example.com/event/img2.jpg'],
        startDate: '2025-08-10',
        endDate: '2025-08-20',
        startTime: '10:00:00',
        endTime: '20:00:00',
        isPopup: true
      };
      
      // 폼 데이터 설정
      setName(dummyEvent.name);
      setDescription(dummyEvent.description);
      setIntro(dummyEvent.intro);
      setThumbnail(dummyEvent.thumbnail);
      setImages(dummyEvent.images);
      setStartDate(dummyEvent.startDate);
      setEndDate(dummyEvent.endDate);
      setStartTime(dummyEvent.startTime);
      setEndTime(dummyEvent.endTime);
      setIsPopup(dummyEvent.isPopup);
      */
      
      // ===== 백엔드 API 버전 (활성화) =====
      
      try {
        const result = await storesAPI.getEvent(eventId);
        
        if (result.success) {
          console.log('이벤트 조회 성공:', result.message);
          const eventData = result.data;
          
          // 폼 데이터 설정
          setName(eventData.name);
          setDescription(eventData.description);
          setIntro(eventData.intro);
          setThumbnail(eventData.thumbnail);
          setImages(eventData.images || []);
          setStartDate(eventData.startDate);
          setEndDate(eventData.endDate);
          setStartTime(eventData.startTime);
          setEndTime(eventData.endTime);
          setIsPopup(eventData.isPopup);
        } else {
          // API 명세서에 따른 에러 메시지 처리
          if (result.code === 401) {
            console.log('로그인이 필요합니다.');
          } else if (result.code === 403) {
            alert('등록된 가게가 없는 사용자입니다.');
            navigate('/mypage/events');
          } else {
            alert(result.message || '이벤트 조회에 실패했습니다.');
            setError(result.message || '이벤트 조회에 실패했습니다.');
          }
        }
      } catch (error) {
        console.error('이벤트 조회 API 오류:', error);
        alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
        setError('서버 연결에 실패했습니다.');
      }
      
    } catch (err) {
      console.error('Failed to fetch event:', err);
      setError('이벤트 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    try {
      // ===== 더미 수정 버전 (주석처리) =====
      /*
      // 더미 이벤트 수정 성공 처리
      alert('이벤트가 성공적으로 수정되었습니다!');
      // 성공 시 이벤트 목록으로 이동
      navigate('/mypage/events');
      */
      
      // ===== 백엔드 API 버전 (활성화) =====
      
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

      const result = await storesAPI.updateEvent(eventId, eventData);
      
      if (result.success) {
        console.log('이벤트 수정 성공:', result.message);
        alert('이벤트가 성공적으로 수정되었습니다!');
        navigate('/mypage/events');
      } else {
        // API 명세서에 따른 에러 메시지 처리
        if (result.code === 401) {
          console.log('로그인이 필요합니다.');
        } else if (result.code === 403) {
          alert('등록된 가게가 없는 사용자입니다.');
        } else if (result.code === 400) {
          alert(result.message || '이벤트 수정에 실패했습니다.');
        } else {
          alert(result.message || '이벤트 수정 중 오류가 발생했습니다.');
        }
      }
      
    } catch (error) {
      console.error('Failed to update event:', error);
      alert('이벤트 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <Page>
        <Header />
        <LoadingContainer>
          <LoadingText>이벤트 정보를 불러오는 중...</LoadingText>
        </LoadingContainer>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Header />
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <BackButton onClick={() => navigate('/mypage/events')}>
            목록으로 돌아가기
          </BackButton>
        </ErrorContainer>
      </Page>
    );
  }

  return (
    <Page>
      <Header />
      <Main>
        <LeftPane>
          <PageTitle>이벤트 수정하기</PageTitle>
          <PageDesc>이벤트 정보를 수정하고 업데이트하세요!</PageDesc>
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
              <CancelButton type="button" onClick={() => navigate('/mypage/events')}>
                취소
              </CancelButton>
              <Submit type="submit" disabled={disabled}>
                이벤트 수정하기
              </Submit>
            </SubmitBar>
          </Form>
        </RightPane>
      </Main>
    </Page>
  );
}

export default MerchantEventEdit;

// ===== util =====
const timeOptions = Array.from({ length: 24 }, (_, h) => {
  const hh = h.toString().padStart(2, '0');
  return [`${hh}:00`, `${hh}:30`];
})
  .flat()
  .filter((_, i) => i % 1 === 0);

// ===== styles =====
const Page = styled.div`
  width: 100%;
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
  gap: 1rem;
  justify-content: flex-end;
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

const CancelButton = styled.button`
  min-width: 120px;
  height: 48px;
  background: transparent;
  color: #666;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #dc3545;
    color: #dc3545;
  }
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

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  gap: 2rem;
`;

const ErrorMessage = styled.div`
  font-size: 1.6rem;
  color: #dc2626;
  text-align: center;
`;

const BackButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 10px;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffe95a;
    transform: translateY(-2px);
  }
`;
