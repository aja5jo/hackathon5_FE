import React, { useState, useEffect, memo, useCallback } from 'react'
import styled from 'styled-components';
import searchIcon from '../../assets/search.png';


const SearchBox = memo(({ onSearch }) => {
    
    const [search, setSearch] = useState('');
    const [forceUpdate, setForceUpdate] = useState(0); // 언어 변경 시 리렌더링 강제
    
    // 언어 변경 이벤트 리스너
    useEffect(() => {
        const handleLanguageChange = () => {
            setForceUpdate(prev => prev + 1);
        };
        
        window.addEventListener('languageChanged', handleLanguageChange);
        
        return () => {
            window.removeEventListener('languageChanged', handleLanguageChange);
        };
    }, []);

    const onChange = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        console.log('검색 제출:', search);
        if (onSearch && search.trim()) {
            onSearch(search.trim());
        }
    }, [search, onSearch]);

    const handleIconClick = useCallback(() => {
        console.log('아이콘 클릭:', search);
        if (onSearch && search.trim()) {
            onSearch(search.trim());
        }
    }, [search, onSearch]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    }, [handleSubmit]);

  return (
    <SearchForm onSubmit={handleSubmit}>
        <SearchContainer>
            <Icon src={searchIcon} alt="검색 아이콘" onClick={handleIconClick} style={{cursor: 'pointer'}}/>
            <SearchInput 
                type="text"
                placeholder="검색어를 입력하세요"
                value={search}
                onChange={onChange}
                onKeyPress={handleKeyPress}
            />
        </SearchContainer>
    </SearchForm>
  )
});

export default SearchBox

const SearchForm = styled.form`
    display: flex;
    width: 100%;
    justify-content: center;
`;

const SearchContainer = styled.div`
    display: flex;
    width: 334px;
    height: 26px;
    gap: 1.2rem;
    margin-top: 2rem;
    padding: 0 15px;
    flex-shrink: 0;
    align-items: center;
    border-radius: 50px;
    border: 1px solid rgba(126, 85, 57, 0.50);
    background: #EFEFEF;
    cursor: text;
    transition: all 0.3s ease;

    &:hover {
        border-color: #FEE502;
        background: #F8F8F8;
    }

    &:focus-within {
        border-color: #FEE502;
        background: white;
        box-shadow: 0 0 0 2px rgba(254, 229, 2, 0.2);
    }
`;

const Icon = styled.img`
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    aspect-ratio: 1/1;
`

const SearchInput =styled.input`
    font-size: 1.2rem;
    color: #7E5539;
    width: 100%;
    background: transparent;
    border: none;
    flex: 1;
    padding: 0.5rem 1rem;
`