import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import SearchInput from 'components/input/SearchInput';
import './Search.scss';

export default function Search() {
  const location = useLocation();
  const [value, setValue] = useState<string>(location.state?.value || '');

  return(
    <>
    <section className='search fullsize'>
      <SearchInput value={value} onChange={(e) => setValue(e.target.value)}/>
    </section>
    </>
  )
}