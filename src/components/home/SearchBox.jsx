import React, { useState } from 'react'
import styled from 'styled-components';

const SearchBox = () => {
    const [search, setSearch]=useState('');

    const onChange = (e)=>{
        setSearch(e.target.value);
    }

  return (
    <SearchContainer>
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
    gap: 0.5rem;
    margin-top: 2rem;
    justify-content: left;
`;

const SearchInput =styled.input`
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 30rem;
`