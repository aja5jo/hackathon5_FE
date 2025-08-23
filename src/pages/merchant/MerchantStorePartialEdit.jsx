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

function MerchantStorePartialEdit() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [currentStore, setCurrentStore] = useState(null);
  
  // 수정할 필드들을 선택적으로 관리
  const [selectedFields, setSelectedFields] = useState({
    name: false,
    address: false,
    number: false,
    intro: false,
    category: false,
    thumbnail: false,
    images: false,
    startTime: false,
    endTime: false
  });
  
  // 수정할 값들을 관리
  const [updateValues, setUpdateValues] = useState({
    name: '',
    address: '',
    number: '',
    intro: '',
    category: '',
    thumbnail: '',
    images: [''],
    startTime: '',
    endTime: ''
  });

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
      
      setCurrentStore(storeData);
      // 초기값 설정
      setUpdateValues({
        name: storeData.name,
        address: storeData.address,
        number: storeData.number,
        intro: storeData.intro,
        category: storeData.category,
        thumbnail: storeData.thumbnail,
        images: storeData.images.length > 0 ? storeData.images : [''],
        startTime: storeData.startTime,
        endTime: storeData.endTime
      });
      */
      
      // ===== 백엔드 API 버전 (활성화) =====
      
      try {
        const result = await storesAPI.getStore(storeId);
        
        if (result.success) {
          const storeData = result.data;
          setCurrentStore(storeData);
          // 초기값 설정
          setUpdateValues({
            name: storeData.name,
            address: storeData.address,
            number: storeData.number,
            intro: storeData.intro,
            category: storeData.category,
            thumbnail: storeData.thumbnail,
            images: storeData.images.length > 0 ? storeData.images : [''],
            startTime: storeData.startTime,
            endTime: storeData.endTime
          });
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

  // 필드 선택 토글
  const toggleFieldSelection = (fieldName) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  // 값 업데이트
  const updateValue = (fieldName, value) => {
    setUpdateValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // 추가 이미지 URL 추가
  const addImageUrl = () => {
    setUpdateValues(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  // 추가 이미지 URL 제거
  const removeImageUrl = (index) => {
    setUpdateValues(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // 추가 이미지 URL 변경
  const updateImageUrl = (index, value) => {
    setUpdateValues(prev => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return {
        ...prev,
        images: newImages
      };
    });
  };

  // 선택된 필드가 있는지 확인
  const hasSelectedFields = useMemo(() => {
    return Object.values(selectedFields).some(selected => selected);
  }, [selectedFields]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasSelectedFields) {
      alert('수정할 필드를 하나 이상 선택해주세요.');
      return;
    }

    try {
      // 선택된 필드만 포함하여 데이터 구성
      const patchData = {};
      
      Object.keys(selectedFields).forEach(fieldName => {
        if (selectedFields[fieldName]) {
          if (fieldName === 'images') {
            patchData[fieldName] = updateValues[fieldName].filter(img => img.trim() !== '');
          } else {
            patchData[fieldName] = updateValues[fieldName];
          }
        }
      });

      // ===== 더미 수정 버전 (주석처리) =====
      /*
      console.log('가게 부분 수정 데이터:', patchData);
      alert('가게 정보가 성공적으로 수정되었습니다!');
      navigate('/mypage/stores');
      */
      
      // ===== 백엔드 API 버전 (활성화) =====
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/merchants/stores/${storeId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(patchData)
        });
        
        if (response.ok) {
          console.log('가게 부분 수정 성공');
          alert('가게 정보가 성공적으로 수정되었습니다!');
          navigate('/mypage/stores');
        } else {
          alert('가게 정보 수정에 실패했습니다.');
        }
      } catch (error) {
        console.error('가게 정보 수정 실패:', error);
        alert('가게 정보 수정에 실패했습니다.');
      }
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
          <PageTitle>가게 정보 부분 수정</PageTitle>
          <PageDesc>수정하고 싶은 필드만 선택하여 부분적으로 수정하세요!</PageDesc>
          <BackButton onClick={() => navigate('/mypage/stores')}>
            ← 가게 목록으로 돌아가기
          </BackButton>
        </LeftPane>

        <RightPane>
          <Form onSubmit={handleSubmit}>
            {/* 가게 이름 */}
            <Field>
              <FieldHeader>
                <Label>가게 이름</Label>
                <Checkbox
                  type="checkbox"
                  checked={selectedFields.name}
                  onChange={() => toggleFieldSelection('name')}
                />
              </FieldHeader>
              <Input
                placeholder="가게 이름을 입력해주세요"
                value={updateValues.name}
                onChange={(e) => updateValue('name', e.target.value)}
                disabled={!selectedFields.name}
              />
            </Field>

            {/* 주소 */}
            <Field>
              <FieldHeader>
                <Label>가게 주소</Label>
                <Checkbox
                  type="checkbox"
                  checked={selectedFields.address}
                  onChange={() => toggleFieldSelection('address')}
                />
              </FieldHeader>
              <Input
                placeholder="주소를 입력해주세요"
                value={updateValues.address}
                onChange={(e) => updateValue('address', e.target.value)}
                disabled={!selectedFields.address}
              />
            </Field>

            {/* 전화번호 */}
            <Field>
              <FieldHeader>
                <Label>전화번호</Label>
                <Checkbox
                  type="checkbox"
                  checked={selectedFields.number}
                  onChange={() => toggleFieldSelection('number')}
                />
              </FieldHeader>
              <Input
                placeholder="전화번호를 입력해주세요 (예: 02-1234-5678)"
                value={updateValues.number}
                onChange={(e) => updateValue('number', e.target.value)}
                disabled={!selectedFields.number}
              />
            </Field>

            {/* 가게 소개 */}
            <Field>
              <FieldHeader>
                <Label>가게 소개</Label>
                <Checkbox
                  type="checkbox"
                  checked={selectedFields.intro}
                  onChange={() => toggleFieldSelection('intro')}
                />
              </FieldHeader>
              <Textarea
                rows={3}
                placeholder="가게에 대한 소개를 입력해주세요"
                value={updateValues.intro}
                onChange={(e) => updateValue('intro', e.target.value)}
                disabled={!selectedFields.intro}
              />
            </Field>

            {/* 카테고리 */}
            <Field>
              <FieldHeader>
                <Label>가게 카테고리</Label>
                <Checkbox
                  type="checkbox"
                  checked={selectedFields.category}
                  onChange={() => toggleFieldSelection('category')}
                />
              </FieldHeader>
              <CategoryGrid>
                {CATEGORIES.map((c) => (
                  <CategoryButton
                    type="button"
                    key={c.key}
                    selected={updateValues.category === c.key}
                    onClick={() => updateValue('category', c.key)}
                    disabled={!selectedFields.category}
                  >
                    {c.label}
                  </CategoryButton>
                ))}
              </CategoryGrid>
            </Field>

            {/* 썸네일 이미지 */}
            <Field>
              <FieldHeader>
                <Label>썸네일 이미지</Label>
                <Checkbox
                  type="checkbox"
                  checked={selectedFields.thumbnail}
                  onChange={() => toggleFieldSelection('thumbnail')}
                />
              </FieldHeader>
              <Input
                placeholder="썸네일 이미지 URL을 입력해주세요"
                value={updateValues.thumbnail}
                onChange={(e) => updateValue('thumbnail', e.target.value)}
                disabled={!selectedFields.thumbnail}
              />
            </Field>

            {/* 추가 이미지들 */}
            <Field>
              <FieldHeader>
                <Label>추가 이미지들</Label>
                <Checkbox
                  type="checkbox"
                  checked={selectedFields.images}
                  onChange={() => toggleFieldSelection('images')}
                />
              </FieldHeader>
              {selectedFields.images && (
                <>
                  {updateValues.images.map((imageUrl, index) => (
                    <ImageUrlRow key={index}>
                      <Input
                        placeholder={`추가 이미지 ${index + 1} URL을 입력해주세요`}
                        value={imageUrl}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                      />
                      {updateValues.images.length > 1 && (
                        <RemoveButton type="button" onClick={() => removeImageUrl(index)}>
                          삭제
                        </RemoveButton>
                      )}
                    </ImageUrlRow>
                  ))}
                  <AddButton type="button" onClick={addImageUrl}>
                    + 이미지 추가
                  </AddButton>
                </>
              )}
            </Field>

            {/* 운영시간 */}
            <Field>
              <FieldHeader>
                <Label>운영시간</Label>
                <Checkbox
                  type="checkbox"
                  checked={selectedFields.startTime || selectedFields.endTime}
                  onChange={() => {
                    toggleFieldSelection('startTime');
                    toggleFieldSelection('endTime');
                  }}
                />
              </FieldHeader>
              <TimeRow>
                <TimeInput
                  type="time"
                  value={updateValues.startTime}
                  onChange={(e) => updateValue('startTime', e.target.value + ':00')}
                  disabled={!selectedFields.startTime}
                />
                <Dash>~</Dash>
                <TimeInput
                  type="time"
                  value={updateValues.endTime}
                  onChange={(e) => updateValue('endTime', e.target.value + ':00')}
                  disabled={!selectedFields.endTime}
                />
              </TimeRow>
            </Field>

            {/* 제출 버튼 */}
            <SubmitButton type="submit" disabled={!hasSelectedFields}>
              선택한 필드 수정하기
            </SubmitButton>
          </Form>
        </RightPane>
      </Main>
    </Page>
  );
}

// Styled Components
const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const Main = styled.main`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 40px;
`;

const LeftPane = styled.div`
  flex: 1;
  max-width: 300px;
`;

const RightPane = styled.div`
  flex: 2;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 12px;
`;

const PageDesc = styled.p`
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const Input = styled.input`
  height: 44px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 16px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #4f46e5;
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #4f46e5;
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
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
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #4f46e5;
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TimeInput = styled.input`
  height: 44px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 12px;
  outline: none;
  font-size: 14px;
  width: 100px;
  
  &:focus {
    border-color: #4f46e5;
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Dash = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
`;

const ImageUrlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const RemoveButton = styled.button`
  height: 32px;
  padding: 0 10px;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 12px;
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
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.16s ease;

  &:hover {
    background: #d1d5db;
    transform: translateY(-1px);
  }
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
  
  &:hover { 
    background: #ffe44b; 
    transform: translateY(-1px); 
  }
  
  &:disabled { 
    opacity: .6; 
    cursor: not-allowed; 
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #6b7280;
`;

export default MerchantStorePartialEdit;
