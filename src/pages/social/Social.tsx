import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Banner from 'components/banner/TopBanner';
import SocialCard from 'components/card/SocialCard';
import SocialService, { SocialFilter, SocialInfo } from 'api/service/SocialService';
import './Social.scss';

import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

export interface SortData {
  sortName: string;
  value: string;
}

const sortList: Array<SortData> = [
  { sortName: '人気順', value: 'rate' },
  { sortName: '新着順', value: 'latest' },
]

export default function Social() {
  const location = useLocation();
  const search = location.search;
  const param = new URLSearchParams(search);
  
  const [load, setLoad] = useState<boolean>(true);
  const [dataList, setDataList] = useState<SocialInfo[]>([]);
  const [value, setValue] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>(sortList[0].value);
  const [selectedSortName, setSelectedSortName] = useState<string>(sortList[0].sortName);

  const socialService = SocialService();

  // パラメータ設定
  useEffect(() => {
    const getValue = param.get('key');
    if (getValue) {
      setValue(getValue);
    } else {
      setValue('');
    }
  }, [param]);

  // ワードがない場合お勧め商品表示、ある場合、そのワードで検索を行う
  useEffect(() => {
    if (location.state?.from === '/search') {
      if (value !== '') {
        getSocialtList();
      }
    } else {
      if (value === '') {
      const recommendFilter: SocialFilter = {
        keyword: ''
      };
      getSocialtList(recommendFilter);
      }
    }
  }, [value]);

  async function getSocialtList(recommendFilter?: SocialFilter) {
    setLoad(true);
    let filter: SocialFilter = recommendFilter || {
      keyword: value
    };
    filter.sort = selectedSort;
    await socialService.socialList(filter).then(data => {
      const socialListWithDateConverted = data.responseData.socialList.map((social: SocialInfo) => ({
        ...social,
        date: new Date(social.date),
      }));
      setDataList(socialListWithDateConverted);
      setLoad(false);
    })
  }
  
  function handleSortItemClick(value: string) {
    switch (value) {
      case 'rate':
        setDataList([...dataList].sort((a, b) => b.likedCount - a.likedCount));
        break;
      case 'latest':
        setDataList([...dataList].sort((a, b) => b.date.getTime() - a.date.getTime()));
        break;
      default:
        setDataList([...dataList]);
        break;
    }
    setSelectedSort(value);
    const selectedSortData = sortList.find((sort) => sort.value === value);
    if (selectedSortData) {
      setSelectedSortName(selectedSortData.sortName);
    }
  };

  function ViewHeader({ sortHandle, sortList }: { sortHandle: (value: string) => void, sortList: SortData[] }) {
    return (
      <div className='view-header'>
        <div className='sort'>
          <div className='sort-item'>
            <select value={selectedSort} onChange={(e) => sortHandle(e.target.value)}>
              {sortList.map((sort) => (
                <option value={sort.value} key={sort.value}>{sort.sortName}</option>
              ))}
            </select>
          </div>
          <div className='sort-name'>{selectedSortName}</div>
          <CompareArrowsIcon className='icon'/>
        </div>
      </div>
    );
  }

  return(
    <section className='social'>
      <Banner background='' url=''/>
      <ViewHeader sortHandle={handleSortItemClick} sortList={sortList}/>
      <SocialCard dataList={dataList} loading={load} additional={true} grid={true}/>
    </section>
  )
}