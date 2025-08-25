import React, { useState } from 'react';
import styled from 'styled-components';
import { storesAPI } from '../../services/api';

const CATEGORIES = [
  { key: 'CAFE', label: '카페' },
  { key: 'CLUB', label: '클럽' },
  { key: 'SHOPPING', label: '쇼핑' },
  { key: 'ETC', label: '기타' },
  { key: 'FOOD', label: '음식점(술집)' },
  { key: 'K_POP', label: 'KPOP' },
  { key: 'ENTERTAINMENT', label: '오락' },
];

function EventAiPreview() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    introHint: '',
    imageUrls: []
  });

  const [previewResult, setPreviewResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 필수 필드 검증
  const isFormValid = formData.name.trim() !== '';



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('이벤트 이름은 필수입니다.');
      return;
    }

    setIsLoading(true);
    setError('');
    setPreviewResult(null);

    try {
      console.log('AI 이벤트 미리보기 요청:', formData);
      
      // 백엔드 요구사항에 맞는 요청 데이터 구성
      const requestData = {
        name: formData.name.trim(),
        category: formData.category || undefined,
        address: formData.address || undefined,
        introHint: formData.introHint || undefined,
        imageUrls: formData.imageUrls.filter(url => url.trim() !== '')
      };
      
      console.log('전송할 데이터:', requestData);
      
      // 실제 API 호출 (명세서에 맞춤)
      const response = await storesAPI.previewEventAi(requestData);
      
      console.log('API 응답:', response);
      
      // 백엔드에서 success 필드 없이 직접 데이터를 반환하는 경우 처리
      if (response.success && response.data) {
        // success 필드가 있는 경우 (기존 방식)
        console.log('미리보기 결과 설정:', response.data);
        setPreviewResult(response.data);
      } else if (response.intro || response.description) {
        // success 필드 없이 직접 데이터가 반환되는 경우
        console.log('미리보기 결과 설정 (직접 응답):', response);
        setPreviewResult(response);
      } else {
        console.error('API 응답 실패:', response);
        throw new Error(response.message || 'AI 미리보기 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('AI 이벤트 미리보기 실패:', error);
      setError(error.message || 'AI 미리보기 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>AI 이벤트 홍보글 미리보기</Title>
      <Description>
        이벤트 정보를 입력하면 AI가 홍보글을 자동으로 생성해드립니다.
      </Description>

      <Form onSubmit={handleSubmit}>
        {/* 이벤트 이름 */}
        <Field>
          <Label>
            이벤트 이름 <Required>*</Required>
          </Label>
          <Input
            placeholder="이벤트 이름을 입력해주세요"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </Field>

        {/* 카테고리 */}
        <Field>
          <Label>카테고리</Label>
          <CategoryGrid>
            {CATEGORIES.map((c) => (
              <CategoryButton
                type="button"
                key={c.key}
                selected={formData.category === c.key}
                onClick={() => setFormData(prev => ({ ...prev, category: c.key }))}
              >
                {c.label}
              </CategoryButton>
            ))}
          </CategoryGrid>
        </Field>

        {/* 주소 */}
        <Field>
          <Label>주소</Label>
          <Input
            placeholder="주소를 입력해주세요"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />
        </Field>

        {/* AI 힌트 */}
        <Field>
          <Label>AI 힌트</Label>
          <Textarea
            placeholder="AI에게 전달할 힌트를 입력해주세요 (예: 젊은 직장인들에게 어필할 수 있게 작성해주세요)"
            value={formData.introHint}
            onChange={(e) => setFormData(prev => ({ ...prev, introHint: e.target.value }))}
            rows={3}
          />
        </Field>

        {/* 이미지 URL들 */}
        <Field>
          <Label>참고 이미지 URL들</Label>
          <Helper>선택사항입니다. 빈 URL은 자동으로 제외됩니다.</Helper>
          <Input
            placeholder="이미지 URL들을 쉼표(,)로 구분하여 입력해주세요"
            value={formData.imageUrls.join(', ')}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              imageUrls: e.target.value.split(',').map(url => url.trim()).filter(url => url !== '')
            }))}
          />
        </Field>



        {/* 제출 버튼 */}
        <SubmitButton type="submit" disabled={!isFormValid || isLoading}>
          {isLoading ? 'AI 생성 중...' : 'AI 홍보글 생성하기'}
        </SubmitButton>
      </Form>

      {/* 에러 메시지 */}
      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      {/* 미리보기 결과 */}
      {previewResult && (
        <PreviewSection>
          <PreviewTitle>AI 생성 결과</PreviewTitle>
          
          <PreviewCard>
            <PreviewLabel>인트로 (요약/후킹)</PreviewLabel>
            <PreviewContent>{previewResult.intro || '인트로 내용이 없습니다.'}</PreviewContent>
          </PreviewCard>

          <PreviewCard>
            <PreviewLabel>상세 설명</PreviewLabel>
            <PreviewContent>{previewResult.description || '상세 설명이 없습니다.'}</PreviewContent>
          </PreviewCard>

          

          <ActionButtons>
            <CopyButton onClick={() => {
              const text = `${previewResult.intro || ''}\n\n${previewResult.description || ''}`;
              navigator.clipboard.writeText(text);
              alert('홍보글이 클립보드에 복사되었습니다!');
            }}>
              전체 복사
            </CopyButton>
            <ResetButton onClick={() => {
              setFormData({
                name: '',
                category: '',
                address: '',
                introHint: '',
                imageUrls: []
              });
              setPreviewResult(null);
              setError('');
            }}>
              다시 작성
            </ResetButton>
          </ActionButtons>
        </PreviewSection>
      )}
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  color: #262626;
  margin-bottom: 1rem;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.6rem;
  color: #666;
  margin-bottom: 3rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Label = styled.label`
  font-size: 1.6rem;
  font-weight: 600;
  color: #374151;
`;

const Required = styled.span`
  color: #ef4444;
`;

const Input = styled.input`
  height: 48px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 16px;
  outline: none;
  font-size: 1.4rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #4f46e5;
  }
`;

const Textarea = styled.textarea`
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  outline: none;
  font-size: 1.4rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #4f46e5;
  }
`;

const Helper = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  margin: 0;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
`;

const CategoryButton = styled.button`
  height: 40px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  background: ${props => props.selected ? '#4f46e5' : 'white'};
  color: ${props => props.selected ? 'white' : '#374151'};
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #4f46e5;
  }
`;



const SubmitButton = styled.button`
  height: 48px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.6rem;
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

const ErrorMessage = styled.div`
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 1.4rem;
  margin-bottom: 2rem;
`;

const PreviewSection = styled.div`
  border-top: 2px solid #e5e7eb;
  padding-top: 2rem;
`;

const PreviewTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #262626;
  margin-bottom: 1.5rem;
`;

const PreviewCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PreviewLabel = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.8rem;
`;

const PreviewContent = styled.p`
  font-size: 1.4rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
`;

const DebugInfo = styled.div`
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 1.2rem;
  color: #374151;
  white-space: pre-wrap;
  font-family: monospace;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const CopyButton = styled.button`
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

const ResetButton = styled.button`
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

export default EventAiPreview;
