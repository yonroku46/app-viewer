import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { UserState } from "store/types/UserActionTypes";
import SocialCard from 'components/card/SocialCard';
import ProductCard from 'components/card/ProductCard';
import SectionTitle from 'components/text/SectionTitle';
import AuthService from 'api/service/AuthService';
import ProductService, { ProductFilter, ProductInfo } from 'api/service/ProductService';
import SocialService, { SocialFilter, SocialInfo } from 'api/service/SocialService';
import './Home.scss';

import KeyboardArrowRightSharpIcon from '@mui/icons-material/KeyboardArrowRightSharp';

export default function Home() {
  const isSp = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  const location = useLocation();

  const title = 'アプリパッケージ\nデモ作成中';
  const subTitle = 'アプリの説明';

  const authService = AuthService();
  const productService = ProductService();
  const socialService = SocialService();

  const [user, setUser] = useState<UserState|undefined>(undefined);
  const [load, setLoad] = useState<boolean>(true);
  const [productList, setProductList] = useState<ProductInfo[]>([]);
  const [socialList, setSocialList] = useState<SocialInfo[]>([]);
  const [offsetLimit, setOffsetLimit] = useState<number>(0);

  const shortcutList = [
    {title:'男性お勧め', backgroundColor: '#D8D8D8', img: 'https://img.dad-labo.com/shortcut/man.webp'},
    {title:'女性お勧め', backgroundColor: '#DADADA', img: 'https://img.dad-labo.com/shortcut/woman.webp'},
    {title:'セール中', backgroundColor: '#E0E0E0', img: 'https://img.dad-labo.com/shortcut/sale.png'},
    {title:'シーズン', backgroundColor: '#E8E8E8', img: 'https://img.dad-labo.com/shortcut/season.png'},
    {title:'ランダム', backgroundColor: '#E1DCDC', img: 'https://img.dad-labo.com/shortcut/random.webp'},
    {title:'帽子', backgroundColor: '#E8E8E8', img: 'https://img.dad-labo.com/shortcut/hats.webp'},
    {title:'トップス', backgroundColor: '#E0E0E0', img: 'https://img.dad-labo.com/shortcut/tops.webp'},
    {title:'パンツ', backgroundColor: '#E0E0E0', img: 'https://img.dad-labo.com/shortcut/pants.webp'},
    {title:'アクセサリー', backgroundColor: '#CDD0D4', img: 'https://img.dad-labo.com/shortcut/accessories.webp'},
    {title:'ブランド', backgroundColor: '#DFE5EB', img: 'https://img.dad-labo.com/shortcut/brand.webp'}
  ]

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    getProductList();
    getSocialtList();
  }, []);

  useEffect(() => {
    setOffsetLimit(isSp ? 6 : 5);
  }, [isSp]);

  async function getProductList(recommendFilter?: ProductFilter) {
    setLoad(true);
    const filter: ProductFilter = recommendFilter || {
      limit: 6,
      sort: 'latest'
    };
    await productService.productList(filter).then(data => {
      setProductList(data.responseData.productList);
      setLoad(false);
    });
  }

  async function getSocialtList(recommendFilter?: SocialFilter) {
    setLoad(true);
    const filter: SocialFilter = recommendFilter || {
      limit: 6,
      sort: 'rate'
    };
    await socialService.socialList(filter).then(data => {
      setSocialList(data.responseData.socialList);
      setLoad(false);
    });
  }

  return(
    <section className='home'>
      <div className='top'>
        {shortcutList.map(shortcut => (
          <div className='item' key={shortcut.title} onClick={() => navigate('/products')}>
            <div className='shortcut' style={{ backgroundColor: shortcut.backgroundColor}}>
              <img src={shortcut.img}/>
            </div>
            <div className='title'>{shortcut.title}</div>
          </div>
        ))}
      </div>
      <div className='middle'>
        <div className='item'>
          <div className='left'>
            <SectionTitle main={'新着アイテム'} sub={'NewArrivals'}/>
            <button className='more-btn' onClick={() => navigate('/products')}>
              <KeyboardArrowRightSharpIcon className='icon'/>
            </button>
          </div>
          <div className='right'>
            <ProductCard dataList={productList.slice(0, offsetLimit)} loading={load}/>
          </div>
        </div>
        <div className='item'>
          <div className='left'>
            <SectionTitle main={'人気スタイル'} sub={'Trend'}/>
            <button className='more-btn' onClick={() => navigate('/social')}>
              <KeyboardArrowRightSharpIcon className='icon'/>
            </button>
          </div>
          <div className='right'>
            <SocialCard dataList={socialList.slice(0, offsetLimit)} loading={load} additional={false}/>
          </div>
        </div>
      </div>
    </section>
  )
}