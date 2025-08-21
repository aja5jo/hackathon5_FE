import React, { useState } from 'react';
import styled from 'styled-components';
// import ApiService from '../../utils/apiService';

const CATEGORIES = [
  { key: 'CAFE', label: '카페' },
  { key: 'CLUB', label: '클럽' },
  { key: 'SHOPPING', label: '쇼핑' },
  { key: 'ETC', label: '기타' },
  { key: 'FOOD', label: '음식점(술집)' },
  { key: 'K_POP', label: 'KPOP' },
  { key: 'ENTERTAINMENT', label: '오락' },
];

function PopupAiPreview() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    introHint: '',
    imageUrls: ['']
  });

  const [previewResult, setPreviewResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 필수 필드 검증 (팝업은 name, category, address가 모두 필수)
  const isFormValid = formData.name.trim() !== '' && 
                     formData.category !== '' && 
                     formData.address.trim() !== '';

  // 추가 이미지 URL 추가
  const addImageUrl = () => {
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, '']
    }));
  };

  // 이미지 URL 제거
  const removeImageUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  // 이미지 URL 변경
  const updateImageUrl = (index, value) => {
    setFormData(prev => {
      const newImageUrls = [...prev.imageUrls];
      newImageUrls[index] = value;
      return {
        ...prev,
        imageUrls: newImageUrls
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('팝업 이름, 카테고리, 주소는 모두 필수입니다.');
      return;
    }

    setIsLoading(true);
    setError('');
    setPreviewResult(null);

    try {
      // ===== 현재 더미 미리보기 버전 (실제 사용 중) =====
      console.log('AI 팝업 미리보기 요청:', formData);
      
      // 더미 응답 데이터 (명세서의 AiPreviewResponse 구조에 맞춤)
      const dummyResponse = {
        success: true,
        code: 200,
        message: "AI 팝업 카피 미리보기 생성 성공",
        data: {
          intro: `${formData.name} 팝업이 ${formData.address}에서 열립니다! ${formData.category} 카테고리의 특별한 경험을 제공합니다.`,
          description: `${formData.introHint ? formData.introHint + ' ' : ''}한정된 기간 동안만 운영되는 특별한 팝업입니다. 놓치지 마시고 방문해보세요! 다양한 체험과 특별한 혜택이 여러분을 기다리고 있습니다.`
        }
      };

      // 실제 API 호출을 시뮬레이션하기 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPreviewResult(dummyResponse.data);
      
      // ===== 백엔드 배포 시 API 버전 (주석처리) =====
      /*
      const response = await ApiService.previewPopupAi({
        name: formData.name.trim(),
        category: formData.category,
        address: formData.address.trim(),
        introHint: formData.introHint || undefined,
        imageUrls: formData.imageUrls.filter(url => url.trim() !== '')
      });
      
      setPreviewResult(response.data);
      */
    } catch (error) {
      console.error('AI 팝업 미리보기 실패:', error);
      setError(error.message || 'AI 미리보기 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>AI 팝업 홍보글 미리보기</Title>
      <Description>
        팝업 정보를 입력하면 AI가 홍보글을 자동으로 생성해드립니다.
      </Description>

      <Form onSubmit={handleSubmit}>
        {/* 팝업 이름 */}
        <Field>
          <Label>
            팝업 이름 <Required>*</Required>
          </Label>
          <Input
            placeholder="팝업 이름을 입력해주세요"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </Field>

        {/* 카테고리 */}
        <Field>
          <Label>
            카테고리 <Required>*</Required>
          </Label>
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
          <Label>
            주소 <Required>*</Required>
          </Label>
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
          {formData.imageUrls.map((imageUrl, index) => (
            <ImageUrlRow key={index}>
              <Input
                placeholder={`이미지 URL ${index + 1}을 입력해주세요`}
                value={imageUrl}
                onChange={(e) => updateImageUrl(index, e.target.value)}
              />
              {formData.imageUrls.length > 1 && (
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
            <PreviewContent>{previewResult.intro}</PreviewContent>
          </PreviewCard>

          <PreviewCard>
            <PreviewLabel>상세 설명</PreviewLabel>
            <PreviewContent>{previewResult.description}</PreviewContent>
          </PreviewCard>

          <ActionButtons>
            <CopyButton onClick={() => {
              navigator.clipboard.writeText(`${previewResult.intro}\n\n${previewResult.description}`);
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
                imageUrls: ['']
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

const ImageUrlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RemoveButton = styled.button`
  height: 32px;
  padding: 0 10px;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
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
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.16s ease;

  &:hover {
    background: #d1d5db;
    transform: translateY(-1px);
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

export default PopupAiPreview;
