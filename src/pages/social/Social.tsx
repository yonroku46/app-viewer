import { MouseEvent, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchArea } from 'components/input/SearchInput';
import SocialCard from 'components/card/SocialCard';
import SectionTitle from 'components/text/SectionTitle';
import SocialService, { SocialFilter, SocialInfo } from 'api/service/SocialService';
import './Social.scss';

export default function Social() {
  const location = useLocation();
  const search = location.search;
  const param = new URLSearchParams(search);
  
  const [load, setLoad] = useState<boolean>(true);
  const [dataList, setDataList] = useState<SocialInfo[]>([]);
  const [value, setValue] = useState<string>('');

  const socialService = SocialService();

  // パラメータ設定
  useEffect(() => {
    const getValue = param.get('v');
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
        keyword: 'Summer',
      };
      getSocialtList(recommendFilter);
      }
    }
  }, [value]);

  async function getSocialtList(recommendFilter?: SocialFilter) {
    setLoad(true);
    const filter: SocialFilter = recommendFilter || {
      keyword: value
    };
    await socialService.socialList(filter).then(data => {
      const socialListWithDateConverted = data.responseData.socialList.map((social: SocialInfo) => ({
        ...social,
        date: new Date(social.date),
      }));
      setDataList(socialListWithDateConverted);
      setLoad(false);
    });
  }

  return(
    <section className='social'>
      <SearchArea value={value}/>
      {value &&
        <SectionTitle main={value} count={dataList.length !== 0 ? dataList.length : 0}/>
      }
      <SocialCard dataList={dataList} loading={load} additional={true}/>
    </section>
  )
}