import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import SearchInput from 'components/input/SearchInput';
import './Search.scss';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = useState<string>('');
  const [ranking, setRanking] = useState<Array<string>>([]);

  useEffect(() => {
    if (location.state?.from) {
      setValue(location.state?.value || '');
    } else {
      navigate(-1);
    }
    const dummmy: Array<string> = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'New Balance', 'Converse', 'Vans', 'Fila', 'ASICS', 'Skechers', 'Jordan', 'Timberland', 'Brooks', 'Salomon', 'Columbia', 'Merrell', 'The North Face', 'Etnies', 'DC Shoes'];
    setRanking(dummmy);
  }, []);

  return(
    <section className='search fullsize'>
      <SearchInput value={value} resetValue={() => setValue('')} ranking={ranking} onChange={(e) => setValue(e.target.value)}/>
    </section>
  )
}