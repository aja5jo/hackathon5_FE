import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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

function MerchantPopup() {
  const navigate = useNavigate();
  
  // API 명세서에 맞는 필드들
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [intro, setIntro] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [images, setImages] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('11:00:00');
  const [endTime, setEndTime] = useState('20:30:00');
  const [address, setAddress] = useState('');

  const disabled = useMemo(() => !category || !name || !description || !intro || !thumbnail || !startDate || !endDate || !address, 
    [category, name, description, intro, thumbnail, startDate, endDate, address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;

    try {
      // API 명세서에 맞는 요청 데이터 구성
      const popupData = {
        category: category,
        name: name.trim(),
        description: description.trim(),
        intro: intro.trim(),
        thumbnail: thumbnail.trim(),
        images: images.filter(img => img.trim() !== ''),
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        address: address.trim()
      };

      // ===== 현재 더미 등록 버전 (실제 사용 중) =====
      // 더미 팝업 등록 성공 처리
      console.log('팝업 등록 데이터:', popupData);
      alert('팝업이 성공적으로 등록되었습니다!');
      // 성공 시 팝업 목록으로 이동
      navigate('/mypage/popups');
      
      // ===== 백엔드 배포 시 API 버전 (주석처리) =====
      /*
      // API 명세서에 맞는 팝업 등록 요청
      const response = await fetch('http://localhost:8080/api/merchants/popups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 기반 인증
        body: JSON.stringify(popupData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('팝업 등록 성공:', result.message);
        alert('팝업이 성공적으로 등록되었습니다!');
        // 성공 시 팝업 목록으로 이동
        navigate('/mypage/popups');
      } else {
        // API 명세서에 따른 에러 메시지 처리
        if (result.code === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else if (result.code === 403) {
          alert('접근 권한이 없습니다.');
        } else {
          alert(result.message || '팝업 등록에 실패했습니다.');
        }
      }
      */
      
      // ===== ApiService 사용 버전 (백엔드 배포 시 사용) =====
      /*
      try {
        const result = await ApiService.createMerchantPopup(popupData);
        
        if (result.success) {
          console.log('팝업 등록 성공:', result.message);
          alert('팝업이 성공적으로 등록되었습니다!');
          navigate('/mypage/popups');
        } else {
          // API 명세서에 따른 에러 메시지 처리
          if (result.code === 401) {
            alert('로그인이 필요합니다.');
            navigate('/login');
          } else if (result.code === 403) {
            alert('접근 권한이 없습니다.');
          } else {
            alert(result.message || '팝업 등록에 실패했습니다.');
          }
        }
      } catch (error) {
        console.error('팝업 등록 API 오류:', error);
        alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
      }
      */
    } catch (error) {
      console.error('Failed to create popup:', error);
      alert('팝업 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Page>
      <Header />
      <Main>
        <LeftPane>
          <PageTitle>팝업스토어 등록하기</PageTitle>
          <PageDesc>팝업스토어를 등록하면 홍보가 가능합니다!</PageDesc>
        </LeftPane>

        <RightPane>
          <Form onSubmit={handleSubmit}>
            {/* 카테고리 */}
            <Field>
              <Label>
                카테고리 <Required>*</Required>
              </Label>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">카테고리를 선택해주세요</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </Field>

            {/* 팝업스토어 이름 */}
            <Field>
              <Label>
                팝업스토어 이름 <Required>*</Required>
              </Label>
              <Input
                placeholder="팝업스토어 이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            {/* 대표 소개글 */}
            <Field>
              <Label>
                대표 소개글 <Required>*</Required>
              </Label>
              <Input
                placeholder="팝업스토어에 대한 간단한 소개글을 입력해주세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            {/* 상세 설명 */}
            <Field>
              <Label>
                상세 설명 <Required>*</Required>
              </Label>
              <Textarea
                rows={5}
                placeholder="팝업스토어에 대한 상세한 설명을 작성해주세요"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
              />
            </Field>

            {/* 주소 */}
            <Field>
              <Label>
                팝업스토어 주소 <Required>*</Required>
              </Label>
              <Input
                placeholder="정확한 주소를 입력해주세요"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Field>

            {/* 운영 기간 */}
            <Field>
              <Label>
                운영 기간 <Required>*</Required>
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

            {/* 운영시간 */}
            <Field>
              <Label>
                운영시간 <Required>*</Required>
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
                placeholder="추가 이미지 URL들을 입력해주세요 (쉼표로 구분)"
                value={images.join(', ')}
                onChange={(e) => setImages(e.target.value.split(',').map(url => url.trim()).filter(url => url !== ''))}
              />
              <Helper>여러 이미지는 쉼표(,)로 구분해주세요</Helper>
            </Field>

            <SubmitBar>
              <CancelButton type="button" onClick={() => navigate('/mypage/popups')}>
                취소
              </CancelButton>
              <Submit type="submit" disabled={disabled}>
                팝업스토어 등록하기
              </Submit>
            </SubmitBar>
          </Form>
        </RightPane>
      </Main>
    </Page>
  );
}

export default MerchantPopup;

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

const Helper = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
`;