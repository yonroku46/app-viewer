import { KeyboardEventHandler, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './SearchInput.scss';

import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface CategoryData {
  categoryName: string;
  img: string;
}

const categoryList: CategoryData[] = [
  { categoryName: 'AA', img: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_11.jpg' },
  { categoryName: 'BB', img: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_10.jpg' },
  { categoryName: 'CC', img: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_9.jpg' },
  { categoryName: 'DD', img: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_8.jpg' },
  { categoryName: '夏色', img: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_7.jpg' },
  { categoryName: 'デイリー', img: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_6.jpg' },
  { categoryName: '人気', img: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_5.jpg' }
]

export function SearchArea({ value }: { value: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  function search(tag: string) {
    if (tag) {
      navigate(`?v=${tag}`, { replace: true });
    }
  }

  return(
    <>
    <div className='search-box'>
      <div className='search-area' onClick={() => navigate('/search', { state: { from: location.pathname, value: value } })}>
        <SearchIcon className='icon'/>
        <input type='text' placeholder='検索' value={value} readOnly/>
      </div>
    </div>
    <div className='category-area'>
      {categoryList.map((category) => (
        <div className='category' key={category.categoryName} onClick={() => search(category.categoryName)}>
          <img src={category.img}/>
          <div className='name'>{category.categoryName}</div>
        </div>
      ))}
    </div>
    <hr/>
    </>
  );
}

export default function SearchInput({ value, onChange }: { value: string, onChange: (e: any) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const storage = window.localStorage;

  const [localHistory, setLocalHistory] = useState<string[]>([]);
  const [trendList, setTrendList] = useState<string[]>(['人気アイテム','パーソナルカラー']);

  useEffect(() => {
    const history = storage.getItem('localHistory');
    if (history !== null) {
      const historyList = history.split(',');
      setLocalHistory(historyList.reverse());
    }
  }, []);

  function delAllHistory() {
    storage.removeItem('localHistory');
    setLocalHistory([]);
    setIsFocused(false);
    setIsHover(false);
  }

  const [isFocused, setIsFocused] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isDelHover, setIsDelHover] = useState(false);
  const handleInputFocus = () => {
    setIsFocused(true);
  };
  const handleInputBlur = () => {
    if (isFocused && !isHover) {
      setIsFocused(false);
    }
  };
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };
  const handleMouseDown = () => {
    if (!isDelHover) {
      setIsFocused(false);
    }
  };

  function searchValueSave() {
    if (!value) {
      return;
    }

    let history = storage.getItem('localHistory') || '';
    const historyList = history.split(',');

    if (historyList.indexOf(value) === -1) {
      history += history ? ',' + value : value;
      storage.setItem('localHistory', history);
    } else {
      const idx = historyList.indexOf(value);
      if (idx > -1) {
        historyList.splice(idx, 1);
        historyList.push(value);
        history = historyList.join(',');
        storage.setItem('localHistory', history);
      }
    }

    if (historyList.length > 5) {
      storage.setItem('localHistory', history.replace(historyList[0] + ',', ''));
    }
  }

  function search(historyValue?: string) {
    if (historyValue) {
      navigate(`${location.state?.from}?v=${historyValue}`, { replace: true });
    } else if (value) {
      searchValueSave();
      navigate(`${location.state?.from}?v=${value}`, { replace: true });
    }
  }

  return(
    <>
      <div className={isFocused ? 'search-box focused' : 'search-box'}>
        <div className='search-area'>
          <SearchIcon className={isFocused ? 'icon focused' : 'icon'} onClick={() => search()} />
          <input type='text' placeholder='検索' value={value} onChange={onChange} onKeyDown={handleKeyDown} onFocus={handleInputFocus} onBlur={handleInputBlur} autoFocus={true}/>
        </div>
        {isFocused && (
          <div className='history-area' onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <div>
              <div className='boundary'/>
              {localHistory.length > 0 ? 
              <> 
                {localHistory.map((history) => (
                  <div className='history' key={history} onClick={() => search(history)}>
                    <SearchIcon className='icon'/>
                    <span>{history}</span>
                  </div>
                ))}
                <div className='del' onMouseDown={handleMouseDown}>
                  <span onMouseDown={delAllHistory} onMouseEnter={() => setIsDelHover(true)} onMouseLeave={() => setIsDelHover(false)}>履歴削除</span>
                </div>
              </>
              :
                trendList.map((trend) => (
                  <div className='trend' key={trend} onClick={() => search(trend)}>
                    <TrendingUpIcon className='icon'/>
                    <span>{trend}</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </>
  );
}