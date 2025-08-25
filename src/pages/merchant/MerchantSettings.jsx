import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { storesAPI, uploadAPI } from '../../services/api';
import Footer from '../../components/common/Footer';
import bannerImg from '../../assets/banner.png';

function MerchantSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    businessNumber: user?.businessNumber || '',
    businessName: user?.businessName || '',
    businessAddress: user?.businessAddress || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isRegisteringStore, setIsRegisteringStore] = useState(false);
  const [storeData, setStoreData] = useState({
    name: '',
    address: '',
    number: '',
    intro: '',
    category: '',
    startTime: '09:00',
    endTime: '22:00',
    images: [],
    otherInfo: '',
    aiRecommendation: false
  });
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // ===== 더미 데이터 버전 (주석처리) =====
    /*
    // 실제로는 API 호출로 데이터 저장
    alert('사업자 정보가 저장되었습니다.');
    setIsEditing(false);
    */
    
    // ===== 백엔드 API 버전 (활성화) =====
    try {
      const response = await fetch('/api/merchants/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('사업자 정보가 저장되었습니다.');
        setIsEditing(false);
      } else {
        alert('사업자 정보 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('사업자 정보 저장 실패:', error);
      alert('사업자 정보 저장에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      businessNumber: user?.businessNumber || '',
      businessName: user?.businessName || '',
      businessAddress: user?.businessAddress || ''
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    alert('비밀번호 변경 기능은 준비 중입니다.');
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      await logout();
      navigate('/');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // 계정 삭제 로직
      localStorage.removeItem('favorites');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      sessionStorage.removeItem('user');
      alert('계정이 삭제되었습니다.');
      navigate('/');
    }
  };

  const handleStoreInputChange = (e) => {
    const { name, value } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }
      
      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      
      setThumbnailImage(file);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStoreRegistration = async () => {
    // 필수 필드 검증
    if (!storeData.name.trim()) {
      alert('가게명은 필수 입력값입니다.');
      return;
    }
    if (!storeData.address.trim()) {
      alert('주소는 필수 입력값입니다.');
      return;
    }
    if (!storeData.number.trim()) {
      alert('전화번호는 필수 입력값입니다.');
      return;
    }
    if (!storeData.intro.trim()) {
      alert('가게 소개는 필수 입력값입니다.');
      return;
    }
    if (!storeData.category) {
      alert('카테고리는 필수 입력값입니다.');
      return;
    }
    if (!thumbnailImage) {
      alert('썸네일 이미지는 필수입니다.');
      return;
    }

    setIsRegisteringStore(true);
    setIsUploading(true);
    
    try {
      // 1. 이미지 업로드
      console.log('이미지 업로드 시작...');
      const uploadResult = await uploadAPI.uploadFileProcess(thumbnailImage, 'stores');
      console.log('이미지 업로드 완료:', uploadResult);
      
      // 2. 가게 등록 (API 명세서에 맞는 형식)
      const storeDataWithImage = {
        name: storeData.name,
        address: storeData.address,
        number: storeData.number,
        intro: storeData.intro,
        category: storeData.category,
        thumbnail: uploadResult.publicUrl,
        images: storeData.images,
        startTime: storeData.startTime + ':00',
        endTime: storeData.endTime + ':00',
        otherInfo: storeData.otherInfo,
        aiRecommendation: storeData.aiRecommendation
      };
      
      console.log('가게 등록 데이터:', storeDataWithImage);
      const result = await storesAPI.createStore(storeDataWithImage);
      
      if (result.success) {
        alert('가게가 성공적으로 등록되었습니다!');
        // 가게등록 완료 후 메인화면으로 이동
        navigate('/');
      } else {
        alert('가게 등록에 실패했습니다: ' + (result.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('가게 등록 실패:', error);
      alert('가게 등록 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsRegisteringStore(false);
      setIsUploading(false);
    }
  };

  const handleCancelStoreRegistration = () => {
    setStoreData({
      name: '',
      address: '',
      number: '',
      intro: '',
      category: '',
      startTime: '09:00',
      endTime: '22:00',
      images: [],
      otherInfo: '',
      aiRecommendation: false
    });
    setThumbnailImage(null);
    setThumbnailPreview('');
    setIsRegisteringStore(false);
    setIsUploading(false);
  };

  return (
    <Container>
      <Banner>
        <BannerTitle>사업자 설정</BannerTitle>
        <BannerSubtitle>내 사업자 정보를 관리하세요</BannerSubtitle>
      </Banner>

      <Content>
        <SettingsSection>
          <SectionTitle>기본 정보</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>이름</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="이름을 입력하세요"
              />
            </FormGroup>

            <FormGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="이메일을 입력하세요"
              />
            </FormGroup>

            <FormGroup>
              <Label>전화번호</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="전화번호를 입력하세요"
              />
            </FormGroup>
          </FormGrid>
        </SettingsSection>

        <SettingsSection>
          <SectionTitle>사업자 정보</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>사업자등록번호</Label>
              <Input
                type="text"
                name="businessNumber"
                value={formData.businessNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="사업자등록번호를 입력하세요"
              />
            </FormGroup>

            <FormGroup>
              <Label>상호명</Label>
              <Input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="상호명을 입력하세요"
              />
            </FormGroup>

            <FormGroup>
              <Label>사업장 주소</Label>
              <Input
                type="text"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="사업장 주소를 입력하세요"
              />
            </FormGroup>
          </FormGrid>

          <ActionButtons>
            {!isEditing ? (
              <EditButton onClick={() => setIsEditing(true)}>
                정보 수정
              </EditButton>
            ) : (
              <>
                <SaveButton onClick={handleSave}>
                  저장
                </SaveButton>
                <CancelButton onClick={handleCancel}>
                  취소
                </CancelButton>
              </>
            )}
          </ActionButtons>
        </SettingsSection>

        <SettingsSection>
          <SectionTitle>가게 등록</SectionTitle>
          {!isRegisteringStore ? (
            <StoreRegistrationPrompt>
              <PromptText>아직 등록된 가게가 없습니다.</PromptText>
              <PromptDesc>첫 번째 가게를 등록해보세요!</PromptDesc>
              <RegisterStoreButton onClick={() => setIsRegisteringStore(true)}>
                가게 등록하기
              </RegisterStoreButton>
            </StoreRegistrationPrompt>
          ) : (
            <>
              <FormGrid>
                                 <FormGroup>
                   <Label>가게 이름 *</Label>
                   <Input
                     type="text"
                     name="name"
                     value={storeData.name}
                     onChange={handleStoreInputChange}
                     placeholder="가게 이름을 입력해주세요"
                   />
                 </FormGroup>

                                   <FormGroup>
                    <Label>가게 장소 *</Label>
                    <Input
                      type="text"
                      name="address"
                      value={storeData.address}
                      onChange={handleStoreInputChange}
                      placeholder="주소 또는 위치를 입력해주세요"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>전화번호 *</Label>
                    <Input
                      type="tel"
                      name="number"
                      value={storeData.number}
                      onChange={handleStoreInputChange}
                      placeholder="가게 전화번호를 입력해주세요 (예: 02-1234-5678)"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>가게 카테고리 선택 *</Label>
                   <CategoryGrid>
                     <CategoryButton
                       type="button"
                       selected={storeData.category === 'CAFE'}
                       onClick={() => setStoreData(prev => ({ ...prev, category: 'CAFE' }))}
                     >
                       카페
                     </CategoryButton>
                     <CategoryButton
                       type="button"
                       selected={storeData.category === 'CLUB'}
                       onClick={() => setStoreData(prev => ({ ...prev, category: 'CLUB' }))}
                     >
                       클럽
                     </CategoryButton>
                     <CategoryButton
                       type="button"
                       selected={storeData.category === 'SHOPPING'}
                       onClick={() => setStoreData(prev => ({ ...prev, category: 'SHOPPING' }))}
                     >
                       쇼핑
                     </CategoryButton>
                     <CategoryButton
                       type="button"
                       selected={storeData.category === 'OTHER'}
                       onClick={() => setStoreData(prev => ({ ...prev, category: 'OTHER' }))}
                     >
                       기타
                     </CategoryButton>
                     <CategoryButton
                       type="button"
                       selected={storeData.category === 'RESTAURANT'}
                       onClick={() => setStoreData(prev => ({ ...prev, category: 'RESTAURANT' }))}
                     >
                       음식점(술집)
                     </CategoryButton>
                     <CategoryButton
                       type="button"
                       selected={storeData.category === 'KPOP'}
                       onClick={() => setStoreData(prev => ({ ...prev, category: 'KPOP' }))}
                     >
                       KPOP
                     </CategoryButton>
                     <CategoryButton
                       type="button"
                       selected={storeData.category === 'ENTERTAINMENT'}
                       onClick={() => setStoreData(prev => ({ ...prev, category: 'ENTERTAINMENT' }))}
                     >
                       오락
                     </CategoryButton>
                   </CategoryGrid>
                   <CategoryDesc>하나의 카테고리만 선택 가능합니다</CategoryDesc>
                 </FormGroup>

                 <FormGroup>
                   <Label>운영시간 *</Label>
                   <TimeContainer>
                     <TimeInput
                       type="time"
                       name="startTime"
                       value={storeData.startTime}
                       onChange={handleStoreInputChange}
                     />
                     <TimeSeparator>~</TimeSeparator>
                     <TimeInput
                       type="time"
                       name="endTime"
                       value={storeData.endTime}
                       onChange={handleStoreInputChange}
                     />
                   </TimeContainer>
                 </FormGroup>

                 <FormGroup>
                   <Label>가게 이미지</Label>
                   <ImageUploadSection>
                     <ImageUploadTitle>대표 사진 업로드</ImageUploadTitle>
                     <FileInput
                       ref={fileInputRef}
                       type="file"
                       accept="image/*"
                       onChange={handleImageUpload}
                       style={{ display: 'none' }}
                     />
                     {thumbnailPreview ? (
                       <ImagePreview>
                         <PreviewImage src={thumbnailPreview} alt="썸네일 미리보기" />
                         <ImageActions>
                           <ChangeImageButton onClick={() => fileInputRef.current.click()}>
                             이미지 변경
                           </ChangeImageButton>
                           <RemoveImageButton onClick={() => {
                             setThumbnailImage(null);
                             setThumbnailPreview('');
                           }}>
                             제거
                           </RemoveImageButton>
                         </ImageActions>
                       </ImagePreview>
                     ) : (
                       <UploadArea onClick={() => fileInputRef.current.click()}>
                         <UploadIcon>📷</UploadIcon>
                         <UploadText>1장 필수 (최대 5MB)</UploadText>
                       </UploadArea>
                     )}
                   </ImageUploadSection>
                 </FormGroup>

                 <FormGroup>
                   <Label>기타 정보</Label>
                   <TextArea
                     name="otherInfo"
                     value={storeData.otherInfo}
                     onChange={handleStoreInputChange}
                     placeholder="룸/흡연 가능 여부, 유아 가능 여부 등 추가 정보를 입력해주세요"
                     rows="4"
                   />
                 </FormGroup>

                 <FormGroup>
                   <Label>가게 소개</Label>
                   <TextArea
                     name="intro"
                     value={storeData.intro}
                     onChange={handleStoreInputChange}
                     placeholder="가게에 대한 소개를 작성해주세요"
                     rows="4"
                   />
                 </FormGroup>

                 <FormGroup>
                   <Label>AI 추천을 받으시겠습니까?</Label>
                   <RadioGroup>
                     <RadioLabel>
                       <RadioInput
                         type="radio"
                         name="aiRecommendation"
                         value="true"
                         checked={storeData.aiRecommendation === true}
                         onChange={(e) => setStoreData(prev => ({ ...prev, aiRecommendation: e.target.value === 'true' }))}
                       />
                       <RadioText>예</RadioText>
                     </RadioLabel>
                     <RadioLabel>
                       <RadioInput
                         type="radio"
                         name="aiRecommendation"
                         value="false"
                         checked={storeData.aiRecommendation === false}
                         onChange={(e) => setStoreData(prev => ({ ...prev, aiRecommendation: e.target.value === 'true' }))}
                       />
                       <RadioText>아니오</RadioText>
                     </RadioLabel>
                   </RadioGroup>
                 </FormGroup>
              </FormGrid>

              <ActionButtons>
                <SaveButton 
                  onClick={handleStoreRegistration}
                  disabled={isRegisteringStore || isUploading}
                >
                  {isUploading ? '이미지 업로드 중...' : isRegisteringStore ? '등록 중...' : '가게 등록'}
                </SaveButton>
                <CancelButton onClick={handleCancelStoreRegistration}>
                  취소
                </CancelButton>
              </ActionButtons>
            </>
          )}
        </SettingsSection>

        <SettingsSection>
          <SectionTitle>보안</SectionTitle>
          <SecurityItem>
            <SecurityInfo>
              <SecurityTitle>비밀번호</SecurityTitle>
              <SecurityDesc>계정 보안을 위해 정기적으로 비밀번호를 변경하세요</SecurityDesc>
            </SecurityInfo>
            <SecurityButton onClick={handleChangePassword}>
              변경
            </SecurityButton>
          </SecurityItem>
        </SettingsSection>

        <SettingsSection>
          <SectionTitle>계정 관리</SectionTitle>
          <DangerZone>
            <DangerTitle>⚠️ 위험 구역</DangerTitle>
            <DangerDesc>이 작업들은 되돌릴 수 없습니다.</DangerDesc>
            <DangerButtons>
              <LogoutButton onClick={handleLogout}>
                로그아웃
              </LogoutButton>
              <DeleteAccountButton onClick={handleDeleteAccount}>
                계정 삭제
              </DeleteAccountButton>
            </DangerButtons>
          </DangerZone>
        </SettingsSection>
      </Content>

      <Footer />
    </Container>
  );
}

export default MerchantSettings;

// ===== styled =====
const Container = styled.div`
  width: 100%;
  background: #ffffff;
`;

const Banner = styled.section`
  width: 100%;
  height: 300px;
  background: 
    linear-gradient(0deg, rgba(102, 92, 14, 0.3) 0%, rgba(102, 92, 14, 0.3) 100%),
    url(${bannerImg});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 1.5rem;
`;

const BannerTitle = styled.h1`
  margin: 0;
  font-size: 5rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -2px;
`;

const BannerSubtitle = styled.p`
  margin: 1rem 0 0 0;
  font-size: 1.8rem;
  font-weight: 400;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const Content = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const SettingsSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 2rem 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1.6rem;
  font-weight: 600;
  color: #262626;
  margin-bottom: 0.8rem;
`;

const Input = styled.input`
  padding: 1.2rem;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  font-size: 1.4rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #FEE502;
  }
  
  &:disabled {
    background: #f8f9fa;
    color: #666;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const EditButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ffe95a;
  }
`;

const SaveButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #218838;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  color: #666;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #dc3545;
    color: #dc3545;
  }
`;

const SecurityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const SecurityInfo = styled.div`
  flex: 1;
`;

const SecurityTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 0.5rem 0;
`;

const SecurityDesc = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0;
`;

const SecurityButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #0056b3;
  }
`;

const DangerZone = styled.div`
  border: 2px solid #dc3545;
  border-radius: 12px;
  padding: 2rem;
  background: #fff5f5;
`;

const DangerTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #dc3545;
  margin: 0 0 0.5rem 0;
`;

const DangerDesc = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 1.5rem 0;
`;

const DangerButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const LogoutButton = styled.button`
  background: transparent;
  color: #dc3545;
  border: 2px solid #dc3545;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #dc3545;
    color: white;
  }
`;

const DeleteAccountButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c82333;
  }
`;

const StoreRegistrationPrompt = styled.div`
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
`;

const PromptText = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 1rem 0;
`;

const PromptDesc = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 2rem 0;
`;

const RegisterStoreButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 8px;
  padding: 1.2rem 2.4rem;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ffe95a;
  }
`;

const Select = styled.select`
  padding: 1.2rem;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  font-size: 1.4rem;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #FEE502;
  }
`;

const TextArea = styled.textarea`
  padding: 1.2rem;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  font-size: 1.4rem;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #FEE502;
  }
`;

const ImageUploadSection = styled.div`
  width: 100%;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadArea = styled.div`
  border: 2px dashed #E5E5E5;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #FEE502;
    background-color: #fefefe;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: #262626;
  margin-bottom: 0.5rem;
`;

const UploadDesc = styled.div`
  font-size: 1.2rem;
  color: #666;
`;

const ImagePreview = styled.div`
  position: relative;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const ImageActions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ChangeImageButton = styled.button`
  background: #FEE502;
  color: #262626;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ffe95a;
  }
`;

const RemoveImageButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c82333;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const CategoryButton = styled.button`
  padding: 1rem;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  background: ${props => props.selected ? '#FEE502' : 'white'};
  color: ${props => props.selected ? '#262626' : '#666'};
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #FEE502;
    background: ${props => props.selected ? '#FEE502' : '#fefefe'};
  }
`;

const CategoryDesc = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 0;
`;

const TimeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TimeInput = styled.input`
  padding: 1.2rem;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  font-size: 1.4rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #FEE502;
  }
`;

const TimeSeparator = styled.span`
  font-size: 1.6rem;
  font-weight: 600;
  color: #666;
`;

const ImageUploadTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: #262626;
  margin-bottom: 1rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 2rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const RadioInput = styled.input`
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
`;

const RadioText = styled.span`
  font-size: 1.4rem;
  color: #262626;
`;
