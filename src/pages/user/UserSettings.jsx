import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Footer from '../../components/common/Footer';
import bannerImg from '../../assets/banner.png';
import { usersAPI } from '../../services/api';


function UserSettings() {
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
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 사용자 카테고리 설정
  const handleCategoryToggle = async (category) => {
    try {
      // ===== 현재 localStorage 버전 (실제 사용 중) =====
      const currentCategories = JSON.parse(localStorage.getItem('userCategories') || '[]');
      const isSelected = currentCategories.includes(category);
      
      if (isSelected) {
        const updatedCategories = currentCategories.filter(cat => cat !== category);
        localStorage.setItem('userCategories', JSON.stringify(updatedCategories));
        setSelectedCategories(updatedCategories);
      } else {
        const updatedCategories = [...currentCategories, category];
        localStorage.setItem('userCategories', JSON.stringify(updatedCategories));
        setSelectedCategories(updatedCategories);
      }
      
      // ===== 백엔드 배포 시 API 버전 (주석처리) =====
      
      try {
        // API 명세서에 맞는 카테고리 토글 요청
        const result = await usersAPI.toggleUserCategory(category);
        
        if (result.success) {
          console.log('카테고리 토글 성공:', result.message);
          // 응답에서 업데이트된 카테고리 목록 가져오기
          if (result.data && result.data.categories) {
            setSelectedCategories(result.data.categories);
          }
        } else {
          // API 명세서에 따른 에러 메시지 처리
          if (result.code === 400) {
            alert(result.message || '카테고리 설정에 실패했습니다.');
          } else if (result.code === 401) {
            alert('로그인이 필요합니다.');
            navigate('/login');
          } else if (result.code === 403) {
            alert('접근 권한이 없습니다.');
          } else {
            alert(result.message || '카테고리 설정 중 오류가 발생했습니다.');
          }
        }
      } catch (error) {
        console.error('카테고리 설정 API 오류:', error);
        alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
      }
      
      

      
    } catch (error) {
      console.error('카테고리 설정 오류:', error);
      alert('카테고리 설정 중 오류가 발생했습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // 실제로는 API 호출로 데이터 저장
    alert('계정 정보가 저장되었습니다.');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
      gender: user?.gender || ''
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    alert('비밀번호 변경 기능은 준비 중입니다.');
  };

  return (
    <Container>
      <Banner>
        <BannerTitle>계정 설정</BannerTitle>
        <BannerSubtitle>내 계정 정보를 관리하세요</BannerSubtitle>
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

            <FormGroup>
              <Label>생년월일</Label>
              <Input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </FormGroup>

            <FormGroup>
              <Label>성별</Label>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
                <option value="other">기타</option>
              </Select>
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
              <DeleteAccountButton onClick={() => navigate('/mypage')}>
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

export default UserSettings;

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

const Select = styled.select`
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
