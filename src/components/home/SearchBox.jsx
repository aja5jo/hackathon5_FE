import React, { useState } from 'react'
import styled from 'styled-components';
import searchIcon from '../../assets/search.png';

const SearchBox = () => {
    const [search, setSearch]=useState('');

    const onChange = (e)=>{
        setSearch(e.target.value);
    }

  return (
    <SearchContainer>
        <Icon src={searchIcon} alt="검색 아이콘"/>
        <SearchInput 
        type="text"
        placeholder="가게이름/이벤트를 검색하세요"
        value={search}
        onChange={onChange}
        />
    </SearchContainer>
  )
}

export default SearchBox

const SearchContainer =styled.div`
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