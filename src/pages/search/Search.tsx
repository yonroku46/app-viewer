import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import SearchInput from 'components/input/SearchInput';
import './Search.scss';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (location.state?.from) {
      setValue(location.state?.value || '');
    } else {
      navigate(-1);
    }
  }, []);

  return(
    <>
      <section className='search fullsize'>
        <SearchInput value={value} resetValue={() => setValue('')} onChange={(e) => setValue(e.target.value)}/>
      </section>
    </>
  )
}