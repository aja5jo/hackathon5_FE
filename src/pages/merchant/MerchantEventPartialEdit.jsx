import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
// import ApiService from '../../utils/apiService'; // 백엔드 배포 시 사용

function MerchantEventPartialEdit() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  
  // 현재 이벤트 데이터
  const [currentEvent, setCurrentEvent] = useState(null);
  
  // 수정할 필드들 (체크박스로 선택)
  const [selectedFields, setSelectedFields] = useState({
    name: false,
    description: false,
    intro: false,
    thumbnail: false,
    images: false,
    startDate: false,
    endDate: false,
    startTime: false,
    endTime: false,
    isPopup: false
  });
  
  // 수정할 값들
  const [updateValues, setUpdateValues] = useState({
    name: '',
    description: '',
    intro: '',
    thumbnail: '',
    images: [],
    startDate: '',
    endDate: '',
    startTime: '10:00:00',
    endTime: '20:00:00',
    isPopup: false
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 이벤트 데이터 로드
  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      
      // ===== 현재 더미 데이터 버전 (실제 사용 중) =====
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
      
      setCurrentEvent(dummyEvent);
      
      // ===== 백엔드 배포 시 API 버전 (주석처리) =====
      /*
      try {
        // API 명세서에 맞는 이벤트 조회 요청
        const response = await fetch(`http://localhost:8080/api/merchants/stores/events/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 세션 기반 인증
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('이벤트 조회 성공:', result.message);
          setCurrentEvent(result.data);
        } else {
          // API 명세서에 따른 에러 메시지 처리
          if (result.code === 401) {
            alert('로그인이 필요합니다.');
            navigate('/login');
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
      */
      
      // ===== ApiService 사용 버전 (백엔드 배포 시 사용) =====
      /*
      try {
        const result = await ApiService.getMerchantEvent(eventId);
        
        if (result.success) {
          console.log('이벤트 조회 성공:', result.message);
          setCurrentEvent(result.data);
        } else {
          // API 명세서에 따른 에러 메시지 처리
          if (result.code === 401) {
            alert('로그인이 필요합니다.');
            navigate('/login');
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
      */
    } catch (err) {
      console.error('Failed to fetch event:', err);
      setError('이벤트 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleValueChange = (field, value) => {
    setUpdateValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 선택된 필드가 있는지 확인
    const hasSelectedFields = Object.values(selectedFields).some(selected => selected);
    if (!hasSelectedFields) {
      alert('수정할 필드를 하나 이상 선택해주세요.');
      return;
    }

    try {
      // 선택된 필드만 포함하는 요청 데이터 구성
      const patchData = {};
      Object.keys(selectedFields).forEach(field => {
        if (selectedFields[field]) {
          if (field === 'images') {
            // 이미지는 배열로 처리
            patchData[field] = updateValues[field].filter(img => img.trim() !== '');
          } else {
            patchData[field] = updateValues[field];
          }
        }
      });

      // ===== 현재 더미 부분 수정 버전 (실제 사용 중) =====
      // 더미 이벤트 부분 수정 성공 처리
      console.log('부분 수정할 데이터:', patchData);
      alert('이벤트가 성공적으로 부분 수정되었습니다!');
      // 성공 시 이벤트 목록으로 이동
      navigate('/mypage/events');
      
      // ===== 백엔드 배포 시 API 버전 (주석처리) =====
      /*
      // API 명세서에 맞는 이벤트 부분 수정 요청 (PATCH)
      const response = await fetch(`http://localhost:8080/api/merchants/stores/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 기반 인증
        body: JSON.stringify(patchData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('이벤트 부분 수정 성공:', result.message);
        alert('이벤트가 성공적으로 부분 수정되었습니다!');
        // 성공 시 이벤트 목록으로 이동
        navigate('/mypage/events');
      } else {
        // API 명세서에 따른 에러 메시지 처리
        if (result.code === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else if (result.code === 403) {
          alert('등록된 가게가 없는 사용자입니다.');
        } else if (result.code === 400) {
          alert(result.message || '이벤트 부분 수정에 실패했습니다.');
        } else {
          alert(result.message || '이벤트 부분 수정 중 오류가 발생했습니다.');
        }
      }
      */
      
      // ===== ApiService 사용 버전 (백엔드 배포 시 사용) =====
      /*
      try {
        const result = await ApiService.patchMerchantEvent(eventId, patchData);
        
        if (result.success) {
          console.log('이벤트 부분 수정 성공:', result.message);
          alert('이벤트가 성공적으로 부분 수정되었습니다!');
          navigate('/mypage/events');
        } else {
          // API 명세서에 따른 에러 메시지 처리
          if (result.code === 401) {
            alert('로그인이 필요합니다.');
            navigate('/login');
          } else if (result.code === 403) {
            alert('등록된 가게가 없는 사용자입니다.');
          } else if (result.code === 400) {
            alert(result.message || '이벤트 부분 수정에 실패했습니다.');
          } else {
            alert(result.message || '이벤트 부분 수정 중 오류가 발생했습니다.');
          }
        }
      } catch (error) {
        console.error('이벤트 부분 수정 API 오류:', error);
        alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
      }
      */
    } catch (error) {
      console.error('Failed to patch event:', error);
      alert('이벤트 부분 수정에 실패했습니다. 다시 시도해주세요.');
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

  if (!currentEvent) {
    return (
      <Page>
        <Header />
        <ErrorContainer>
          <ErrorMessage>이벤트 정보를 찾을 수 없습니다.</ErrorMessage>
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
          <PageTitle>이벤트 부분 수정하기</PageTitle>
          <PageDesc>수정하고 싶은 필드만 선택하여 부분적으로 수정하세요!</PageDesc>
          
          <CurrentInfo>
            <CurrentTitle>현재 이벤트 정보</CurrentTitle>
            <CurrentItem>
              <strong>이름:</strong> {currentEvent.name}
            </CurrentItem>
            <CurrentItem>
              <strong>소개:</strong> {currentEvent.description}
            </CurrentItem>
            <CurrentItem>
              <strong>기간:</strong> {currentEvent.startDate} ~ {currentEvent.endDate}
            </CurrentItem>
            <CurrentItem>
              <strong>시간:</strong> {currentEvent.startTime} ~ {currentEvent.endTime}
            </CurrentItem>
            <CurrentItem>
              <strong>타입:</strong> {currentEvent.isPopup ? '팝업' : '일반 이벤트'}
            </CurrentItem>
          </CurrentInfo>
        </LeftPane>

        <RightPane>
          <Form onSubmit={handleSubmit}>
            <SectionTitle>수정할 필드 선택 및 입력</SectionTitle>
            
            {/* 이벤트 이름 */}
            <Field>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFields.name}
                  onChange={() => handleFieldToggle('name')}
                />
                <span>이벤트 이름 수정</span>
              </CheckboxLabel>
              {selectedFields.name && (
                <Input
                  placeholder="새로운 이벤트 이름을 입력해주세요"
                  value={updateValues.name}
                  onChange={(e) => handleValueChange('name', e.target.value)}
                />
              )}
            </Field>

            {/* 이벤트 대표 소개글 */}
            <Field>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFields.description}
                  onChange={() => handleFieldToggle('description')}
                />
                <span>이벤트 대표 소개글 수정</span>
              </CheckboxLabel>
              {selectedFields.description && (
                <Input
                  placeholder="새로운 대표 소개글을 입력해주세요"
                  value={updateValues.description}
                  onChange={(e) => handleValueChange('description', e.target.value)}
                />
              )}
            </Field>

            {/* 이벤트 기간 */}
            <Field>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFields.startDate || selectedFields.endDate}
                  onChange={() => {
                    handleFieldToggle('startDate');
                    handleFieldToggle('endDate');
                  }}
                />
                <span>이벤트 기간 수정</span>
              </CheckboxLabel>
              {(selectedFields.startDate || selectedFields.endDate) && (
                <TimeRow>
                  <Input
                    type="date"
                    placeholder="시작일"
                    value={updateValues.startDate}
                    onChange={(e) => handleValueChange('startDate', e.target.value)}
                  />
                  <Dash>~</Dash>
                  <Input
                    type="date"
                    placeholder="종료일"
                    value={updateValues.endDate}
                    onChange={(e) => handleValueChange('endDate', e.target.value)}
                  />
                </TimeRow>
              )}
            </Field>

            {/* 이벤트 시간 */}
            <Field>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFields.startTime || selectedFields.endTime}
                  onChange={() => {
                    handleFieldToggle('startTime');
                    handleFieldToggle('endTime');
                  }}
                />
                <span>이벤트 시간 수정</span>
              </CheckboxLabel>
              {(selectedFields.startTime || selectedFields.endTime) && (
                <TimeRow>
                  <Select 
                    value={updateValues.startTime} 
                    onChange={(e) => handleValueChange('startTime', e.target.value)}
                  >
                    {timeOptions.map((t) => (
                      <option key={`s-${t}`} value={`${t}:00`}>
                        {t}
                      </option>
                    ))}
                  </Select>
                  <Dash>~</Dash>
                  <Select 
                    value={updateValues.endTime} 
                    onChange={(e) => handleValueChange('endTime', e.target.value)}
                  >
                    {timeOptions.map((t) => (
                      <option key={`e-${t}`} value={`${t}:00`}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </TimeRow>
              )}
            </Field>

            {/* 썸네일 이미지 */}
            <Field>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFields.thumbnail}
                  onChange={() => handleFieldToggle('thumbnail')}
                />
                <span>썸네일 이미지 수정</span>
              </CheckboxLabel>
              {selectedFields.thumbnail && (
                <Input
                  type="url"
                  placeholder="새로운 썸네일 이미지 URL을 입력해주세요"
                  value={updateValues.thumbnail}
                  onChange={(e) => handleValueChange('thumbnail', e.target.value)}
                />
              )}
            </Field>

            {/* 추가 이미지들 */}
            <Field>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFields.images}
                  onChange={() => handleFieldToggle('images')}
                />
                <span>추가 이미지들 수정</span>
              </CheckboxLabel>
              {selectedFields.images && (
                <Input
                  type="url"
                  placeholder="새로운 추가 이미지 URL들을 입력해주세요 (쉼표로 구분)"
                  value={updateValues.images.join(', ')}
                  onChange={(e) => handleValueChange('images', e.target.value.split(',').map(url => url.trim()).filter(url => url !== ''))}
                />
              )}
            </Field>

            {/* 이벤트 상세 설명 */}
            <Field>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFields.intro}
                  onChange={() => handleFieldToggle('intro')}
                />
                <span>이벤트 상세 설명 수정</span>
              </CheckboxLabel>
              {selectedFields.intro && (
                <Textarea
                  rows={5}
                  placeholder="새로운 이벤트 상세 설명을 작성해주세요"
                  value={updateValues.intro}
                  onChange={(e) => handleValueChange('intro', e.target.value)}
                />
              )}
            </Field>

            {/* 팝업 여부 */}
            <Field>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFields.isPopup}
                  onChange={() => handleFieldToggle('isPopup')}
                />
                <span>팝업 여부 수정</span>
              </CheckboxLabel>
              {selectedFields.isPopup && (
                <RadioRow>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="isPopup"
                      checked={updateValues.isPopup === true}
                      onChange={() => handleValueChange('isPopup', true)}
                    />
                    <span>팝업</span>
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="isPopup"
                      checked={updateValues.isPopup === false}
                      onChange={() => handleValueChange('isPopup', false)}
                    />
                    <span>일반 이벤트</span>
                  </RadioLabel>
                </RadioRow>
              )}
            </Field>

            <SubmitBar>
              <CancelButton type="button" onClick={() => navigate('/mypage/events')}>
                취소
              </CancelButton>
              <Submit type="submit">
                선택한 필드만 수정하기
              </Submit>
            </SubmitBar>
          </Form>
        </RightPane>
      </Main>
    </Page>
  );
}

export default MerchantEventPartialEdit;

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
  margin: 0 0 24px 0;
`;

const CurrentInfo = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
`;

const CurrentTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin: 0 0 16px 0;
`;

const CurrentItem = styled.div`
  font-size: 14px;
  color: #495057;
  margin-bottom: 8px;
  
  strong {
    color: #222;
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

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #222;
  margin: 0 0 16px 0;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fafbfc;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #222;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #fee502;
  }
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
