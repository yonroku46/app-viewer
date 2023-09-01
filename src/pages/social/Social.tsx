import { MouseEvent, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchArea } from 'components/input/SearchInput';
import SocialCard from 'components/card/SocialCard';
import SocialService, { SocialFilter, SocialInfo } from 'api/service/SocialService';
import './Social.scss';

export default function Social() {
  const search = useLocation().search;
  const param = new URLSearchParams(search);
  
  const [dataList, setDataList] = useState<SocialInfo[]>([]);
  const [value, setValue] = useState<string>('');

  const socialService = new SocialService();

  // 初期検索ワードがない場合、お勧め商品表示
  useEffect(() => {
    const getValue = param.get('v');
    if (!getValue) {
      const recommendFilter: SocialFilter = {
        // keyword: 'おしゃれ',
      };
      getSocialtList(recommendFilter);
    }
  }, []);

  // 検索ワードがある場合、再検索を行う
  useEffect(() => {
    if (value) {
      getSocialtList();
    }
  }, [value]);

  useEffect(() => {
    const getValue = param.get('v');
    if (getValue) {
      setValue(getValue);
    } else {
      setValue('');
    }
  }, [param]);

  async function getSocialtList(recommendFilter?: SocialFilter) {
    const filter: SocialFilter = recommendFilter || {
      keyword: value
    };
    await socialService.socialList(filter).then(data => {
      const socialListWithDateConverted = data.responseData.socialList.map((social: SocialInfo) => ({
        ...social,
        date: new Date(social.date),
      }));
      setDataList(socialListWithDateConverted);
    });
  }

  return(
    <>
    <section className='social'>
      <SearchArea value={value}/>
      {value ? 
      <>
        {/* 検索結果 */}
        <div className='menu-title'>
          <div className='sub'>Result</div>
          <div className='main'>
            <span style={{ color: 'var(--main-color)' }}>"{value}"</span> {dataList.length}件
          </div>
        </div>
        <SocialCard dataList={dataList} additional={true}/>
      </>
      :
        <SocialCard dataList={dataList} additional={true}/>
      }
    </section>
    </>
  )
}