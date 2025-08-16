import React, { useState } from 'react'
import styled from 'styled-components';
import searchIcon from '../../assets/search.png';

const SearchBox = ({ onSearch }) => {
    const [search, setSearch] = useState('');

    const onChange = (e) => {
        setSearch(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (search.trim() && onSearch) {
            onSearch(search.trim());
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    }

  return (
    <SearchForm onSubmit={handleSubmit}>
        <SearchContainer>
            <Icon src={searchIcon} alt="검색 아이콘"/>
            <SearchInput 
                type="text"
                placeholder="가게이름/이벤트를 검색하세요"
                value={search}
                onChange={onChange}
                onKeyPress={handleKeyPress}
            />
        </SearchContainer>
    </SearchForm>
  )
}

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