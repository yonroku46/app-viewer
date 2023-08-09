import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { useWindowScroll } from 'react-use';
import ProductCard, { ProductData } from 'components/product/ProductCard';
import StyleCard, { StyleData } from 'components/style/StyleCard';
import Guide from 'components/guide/Guide';
import { useDispatch } from "react-redux";
import { showTopPopup } from "redux/actions/popupActions";
import { currency, calcDiscountRate, dateToString } from 'common/utils/StringUtils';
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Products.scss';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import LayersClearRoundedIcon from '@mui/icons-material/LayersClearRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import CollectionsTwoToneIcon from '@mui/icons-material/CollectionsTwoTone';
import LibraryAddCheckTwoToneIcon from '@mui/icons-material/LibraryAddCheckTwoTone';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';
import FitScreenOutlinedIcon from '@mui/icons-material/FitScreenOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';
import HighlightAltTwoToneIcon from '@mui/icons-material/HighlightAltTwoTone';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

export default function ProductDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSp = useMediaQuery({ maxWidth: 767 });
  const { id } = useParams();

  const { y: windowY } = useWindowScroll();
  const spareArea: number = 100;

  useEffect(() => {
    if (windowY > spareArea) {
      setFabShow(true);
    } else {
      setFabShow(false);
    }
  }, [windowY]);

  const prodDummy: ProductData = {
    id: 1,
    liked: false,
    date: new Date(2023, 6, 13),
    name: 'Nike Air Force',
    imgs: [
      'https://minimal-kit-react.vercel.app/assets/images/products/product_1.jpg',
      'https://minimal-kit-react.vercel.app/assets/images/products/product_2.jpg',
      'https://minimal-kit-react.vercel.app/assets/images/products/product_3.jpg',
      'https://minimal-kit-react.vercel.app/assets/images/products/product_4.jpg',
      'https://minimal-kit-react.vercel.app/assets/images/products/product_5.jpg',
      'https://minimal-kit-react.vercel.app/assets/images/products/product_6.jpg',
      'https://minimal-kit-react.vercel.app/assets/images/products/product_7.jpg',
      'https://minimal-kit-react.vercel.app/assets/images/products/product_8.jpg',
      'https://minimal-kit-react.vercel.app/assets/images/products/product_9.jpg',
      'https://minimal-kit-react.vercel.app/assets/images/products/product_10.jpg'
    ],
    sizeImgIndex: 1,
    price: 5000,
    priceSale: 3000,
    brand: 'Dickies',
    colors: ['green', 'white', 'red', 'gray', 'yellow'],
    status: 'S',
    size: [
      {name: 'ウエスト', value: '72', unit: 'cm'},
      {name: 'ヒップ', value: '100', unit: 'cm'},
      {name: 'パンツ丈', value: '107', unit: 'cm'},
      {name: 'すそ周り', value: '74', unit: 'cm'},
      {name: '裾', value: '54', unit: 'cm'},
    ],
    mainCategory: 'パンツ',
    subCategory: 'デニム',
    type: 'M',
    tags: ['おしゃれ', '夏服', '新品'],
    additional: [
      {name: '素材', value: 'コットン100%'},
      {name: '生産国', value: '米国'},
    ],
    history: [
      {
        id: 1,
        date: new Date(2023, 7, 4),
        name: 'Nike Air Force',
        imgs: [
          'https://minimal-kit-react.vercel.app/assets/images/products/product_6.jpg',
          'https://minimal-kit-react.vercel.app/assets/images/products/product_7.jpg',
          'https://minimal-kit-react.vercel.app/assets/images/products/product_8.jpg',
          'https://minimal-kit-react.vercel.app/assets/images/products/product_9.jpg',
          'https://minimal-kit-react.vercel.app/assets/images/products/product_10.jpg',
        ],
        price: 5000,
        colors: ['green', 'white', 'red', 'gray', 'yellow'],
        status: 'A',
        size: [
          {name: 'ウエスト', value: '72', unit: 'cm'},
          {name: 'ヒップ', value: '100', unit: 'cm'},
          {name: 'パンツ丈', value: '107', unit: 'cm'},
          {name: 'すそ周り', value: '74', unit: 'cm'},
          {name: '裾', value: '54', unit: 'cm'},
        ],
        mainCategory: 'パンツ',
        subCategory: 'デニム',
        type: 'M'
      },
      {
        id: 1,
        date: new Date(2023, 7, 8),
        name: 'Nike Air Force',
        imgs: [
          'https://minimal-kit-react.vercel.app/assets/images/products/product_7.jpg',
          'https://minimal-kit-react.vercel.app/assets/images/products/product_10.jpg',
        ],
        price: 6000,
        colors: ['green', 'white', 'red', 'gray', 'yellow'],
        status: 'B',
        size: [
          {name: 'ウエスト', value: '72', unit: 'cm'},
          {name: 'ヒップ', value: '100', unit: 'cm'},
          {name: 'パンツ丈', value: '107', unit: 'cm'},
          {name: 'すそ周り', value: '74', unit: 'cm'},
          {name: '裾', value: '54', unit: 'cm'},
        ],
        mainCategory: 'パンツ',
        subCategory: 'デニム',
        type: 'M'
      }
    ]
  };

  const recommends: ProductData[] = [
    {
      id: 1,
      liked: true,
      date: new Date(2023, 7, 18),
      name: 'Nike Air Force',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_1.jpg'],
      price: 5000,
      priceSale: 3000,
      colors: ['green', 'white'],
      status: 'S',
      size: [
        {name: 'ウエスト', value: '72', unit: 'cm'},
        {name: 'ヒップ', value: '100', unit: 'cm'},
        {name: 'パンツ丈', value: '107', unit: 'cm'},
        {name: 'すそ周り', value: '74', unit: 'cm'},
        {name: '裾', value: '54', unit: 'cm'},
      ],
      mainCategory: 'パンツ',
      subCategory: 'デニム',
      type: 'M'
    },
    {
      id: 2,
      liked: true,
      date: new Date(2023, 7, 20),
      name: 'Nike Space Hippie 04 SUPER Edition',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_2.jpg'],
      price: 10200,
      colors: ['lightgray', 'orange'],
      status: 'S',
      size: [
        {name: 'ウエスト', value: '72', unit: 'cm'},
        {name: 'ヒップ', value: '100', unit: 'cm'},
        {name: 'パンツ丈', value: '107', unit: 'cm'},
        {name: 'すそ周り', value: '74', unit: 'cm'},
        {name: '裾', value: '54', unit: 'cm'},
      ],
      mainCategory: 'パンツ',
      subCategory: 'デニム',
      type: 'M',
    },
    {
      id: 3,
      liked: false,
      date: new Date(2023, 7, 18),
      name: 'Nike Air Max Zephyr',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_7.jpg'],
      price: 8900,
      colors: ['green', 'red'],
      status: 'S',
      size: [
      {name: 'ウエスト', value: '72', unit: 'cm'},
      {name: 'ヒップ', value: '100', unit: 'cm'},
      {name: 'パンツ丈', value: '107', unit: 'cm'},
      {name: 'すそ周り', value: '74', unit: 'cm'},
      {name: '裾', value: '54', unit: 'cm'},
    ],
    mainCategory: 'パンツ',
    subCategory: 'デニム',
    type: 'M',
    },
    {
      id: 4,
      liked: false,
      date: new Date(2023, 7, 17),
      name: 'Jodern Delta',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_8.jpg'],
      price: 10200,
      colors: ['yellowgreen', 'blue'],
      status: 'S',
      size: [
      {name: 'ウエスト', value: '72', unit: 'cm'},
      {name: 'ヒップ', value: '100', unit: 'cm'},
      {name: 'パンツ丈', value: '107', unit: 'cm'},
      {name: 'すそ周り', value: '74', unit: 'cm'},
      {name: '裾', value: '54', unit: 'cm'},
    ],
    mainCategory: 'パンツ',
    subCategory: 'デニム',
    type: 'M',
    },
    {
      id: 5,
      liked: false,
      date: new Date(2023, 6, 17),
      name: 'Nike Air Max Up',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_17.jpg'],
      price: 9200,
      colors: ['white', 'pink'],
      status: 'S',
      size: [
      {name: 'ウエスト', value: '72', unit: 'cm'},
      {name: 'ヒップ', value: '100', unit: 'cm'},
      {name: 'パンツ丈', value: '107', unit: 'cm'},
      {name: 'すそ周り', value: '74', unit: 'cm'},
      {name: '裾', value: '54', unit: 'cm'},
    ],
    mainCategory: 'パンツ',
    subCategory: 'デニム',
    type: 'M',
    }
  ]
  const recommendsSp: ProductData[] = recommends.slice();
  recommendsSp.push({
    id: 6,
    liked: false,
    date: new Date(2023, 6, 17),
    name: 'Nike Air Max Up',
    imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_18.jpg'],
    price: 9200,
    colors: ['white', 'pink'],
    status: 'S',
    size: [
      {name: 'ウエスト', value: '72', unit: 'cm'},
      {name: 'ヒップ', value: '100', unit: 'cm'},
      {name: 'パンツ丈', value: '107', unit: 'cm'},
      {name: 'すそ周り', value: '74', unit: 'cm'},
      {name: '裾', value: '54', unit: 'cm'},
    ],
    mainCategory: 'パンツ',
    subCategory: 'デニム',
    type: 'M',
  });

  const recommendsStyle: StyleData[] = [
    {
      id: 1,
      favorited: true,
      date: new Date(2023, 7, 18),
      profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_2.jpg',
      name: 'TestUser',
      imgs: ['https://jamtrading.jp/coordinate/wp-content/uploads/2023/08/oneday_logo1-375x540.jpg'],
      size: [
        {name: '身長', value: '172', unit: 'cm'},
      ],
      type: 'M'
    },
    {
      id: 2,
      favorited: true,
      date: new Date(2023, 7, 20),
      profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_2.jpg',
      name: 'TestUser',
      imgs: ['https://jamtrading.jp/coordinate/wp-content/uploads/2023/07/oneday_logo23-375x540.jpg'],
      size: [
        {name: '身長', value: '163', unit: 'cm'},
      ],
      type: 'M',
    },
    {
      id: 3,
      favorited: false,
      date: new Date(2023, 7, 18),
      profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_2.jpg',
      name: 'TestUser',
      imgs: ['	https://jamtrading.jp/coordinate/wp-content/uploads/2023/07/oneday_logo14-375x540.jpg'],
      size: [
      {name: '身長', value: '175', unit: 'cm'},
    ],
    type: 'M',
    },
    {
      id: 4,
      favorited: false,
      date: new Date(2023, 7, 17),
      profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_2.jpg',
      name: 'TestUser',
      imgs: ['https://jamtrading.jp/coordinate/wp-content/uploads/2023/07/oneday_logo17-375x540.jpg'],
      size: [
      {name: '身長', value: '180', unit: 'cm'},
    ],
    type: 'M',
    },
    {
      id: 5,
      favorited: false,
      date: new Date(2023, 6, 17),
      profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_2.jpg',
      name: 'TestUser',
      imgs: ['https://jamtrading.jp/coordinate/wp-content/uploads/2023/08/oneday_logo4-375x540.jpg'],
      size: [
      {name: '身長', value: '170', unit: 'cm'},
    ],
    type: 'M',
    }
  ]
  const recommendsStyleSp: StyleData[] = recommendsStyle.slice();
  recommendsStyleSp.push({
    id: 6,
    favorited: false,
    date: new Date(2023, 6, 17),
    profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_10.jpg',
    name: 'SpUser',
    imgs: ['https://jamtrading.jp/coordinate/wp-content/uploads/2023/07/oneday_logo30-375x540.jpg'],
    size: [
      {name: '身長', value: '169', unit: 'cm'},
    ],
    type: 'M',
  });


  const [prod, setProd] = useState<ProductData>(prodDummy);
  const [snapShow, setSnapShow] = useState<boolean>(true);
  const [thumbShow, setThumbShow] = useState<boolean>(true);
  const [thumbCompShow, setThumbCompShow] = useState<boolean>(true);
  const [historyShow, setHistoryShow] = useState<boolean>(false);
  const [fabShow, setFabShow] = useState<boolean>(false);
  const [buyStatus, setBuyStatus] = useState<boolean>(true);
  const [compMode, setCompMode] = useState<boolean>(false);
  const [offerPrice, setOfferPrice] = useState<number>(0);

  const prodStatusList: string[] = [
    'S', 'A', 'B', 'C', 'D'
  ]

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  function handleChange(index: number) {
    setCurrentIndex(index);
  }
  const [currentCompIndex, setCurrentCompIndex] = useState<number>(0);
  function handleCompChange(index: number) {
    setCurrentCompIndex(index);
  }
  const [currentCompHistoryIndex, setCurrentCompHistoryIndex] = useState<number | undefined>();
  function handleHistoryChange(index?: number) {
    setCurrentCompHistoryIndex(index);
    setHistoryShow(false);
    setCompMode(true);
  }

  const offerPriceHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(inputValue, 10);
    setOfferPrice(isNaN(numericValue) ? 0 : numericValue);
  }

  function compToggle() {
    setCompMode(!compMode)
    if (isSp) {
      setSnapShow(compMode);
    }
    setThumbShow(true);
    setThumbCompShow(true);
  }
  
  function liked() {
    setProd((prevProd) => ({
      ...prevProd,
      liked: !prevProd.liked
    }));
  }

  function share() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        dispatch(showTopPopup('URLをコピーしました'));
      }, (error) => {}
    );
  }

  function scrollToTop() {
    window.scrollTo({ top: 0 });
  }

  function ProductDefinition() {
    return(
      <div className='definition'>
        <dl key='type'>
          <dt>性別タイプ</dt>
          <dd>{prod.type === 'M' ? 'メンズ' : prod.type === 'W' ? 'レディース' : 'メンズ・レディース'}</dd>
        </dl>
        <dl key='category'>
          <dt>カテゴリー</dt>
          <dd>
            <span className='link' key={prod.mainCategory}>
              <a href='#'>{prod.mainCategory}</a>
            </span>
            {prod.subCategory &&
              <span className='link' key={prod.subCategory}>
                <a href='#'>{prod.subCategory}</a>
              </span>
            }
          </dd>
        </dl>
        {prod.additional &&
          prod.additional.map((data, index) => 
            <dl key={'additional ' + index}>
              <dt>{data.name}</dt>
              <dd>{data.value}</dd>
            </dl>
          )
        }
        {prod.brand &&
          <dl key='brand'>
            <dt>ブランド</dt>
            <dd>
              <span className='link' key={prod.brand}>
                <a href='#'>{prod.brand}</a>
              </span>
            </dd>
          </dl>
        }
        <dl key='colors'>
          <dt>カラー</dt>
          <dd>
            <div className='colors'>
              {prod.colors.map((color) => (
                <Tooltip title={color} placement="top-end" key={color} arrow>
                  <span style={{ backgroundColor: color }}></span>
                </Tooltip>
              ))}
            </div>
          </dd>
        </dl>
        {prod.tags &&
          <dl key='tags'>
            <dt>関連タグ</dt>
            <dd>
              {prod.tags.map(tag =>
                <span className='link' key={tag}>
                  <a href='#'>{tag}</a>
                </span>
              )}
            </dd>
          </dl>
        }
      </div>
    )
  }

  return(
    <>
    <section className='product-detail'>
      <Fab className={fabShow ? 'fab active' : 'fab'} size='small' onClick={() => scrollToTop()}>
        <NavigationRoundedIcon/>
      </Fab>
      {/* スナップ情報 */}
      <div className={snapShow ? 'snap-area active' : 'snap-area'}>
        <div className='snap'>
          <div className={historyShow ? 'select-history active' : 'select-history'}>
            <div className='thumbnail-list'>
              {prod.history?.map((history, index) => 
                <div className='thumbnail-data' onClick={() => handleHistoryChange(index)}>
                  <img className='thumbnail' key={history.imgs[0]} src={history.imgs[0]}/>
                  <div>
                    <div className='date'>{dateToString(history.date)}</div>
                    <div className='user'>{prod.history && prod.history.length - index + '回前のユーザー'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <img className='thumbnail' src={prod.imgs[0]} onClick={() => setHistoryShow(!historyShow)}/>
          <div className='top'>
            {prod.history &&
              <button className={compMode ? buyStatus ? 'comp buy active' : 'comp offer active' : 'comp'} onClick={() => compToggle()}>
                {compMode ? <CollectionsTwoToneIcon className='icon'/> : <LibraryAddCheckTwoToneIcon className='icon'/>}
              </button>
            }
            <button className={prod.liked ? 'like liked' : 'like'} onClick={() => liked()}>
              <StarRoundedIcon className='icon'/>
            </button>
            <button className='share' onClick={() => share()}>
              <ShareTwoToneIcon className='icon'/>
            </button>
            {prod.priceSale && buyStatus &&
              <div className='sale-label'>
                <span>
                  {calcDiscountRate(prod.price, prod.priceSale) + 'OFF'}
                </span>
              </div>
            }
            <div className={prod.priceSale && buyStatus ? 'name' : 'name not-sale'}>
              {prod.name}
            </div>
          </div>
        </div>
      </div>
      <div className={snapShow ? 'snap-toggle active' : 'snap-toggle'} onClick={() => setSnapShow(!snapShow)}>
        <KeyboardArrowRightIcon className={snapShow ? 'icon active' : 'icon'}/>
      </div>
      {/* 詳細情報 */}
      <div className={snapShow ? 'product' : 'product hide'}>
        <div className={isSp && compMode ? 'img-area comp' : 'img-area'}>
          <div className='features'>
            <div className={compMode && thumbShow ? buyStatus ? 'data-info buy active' : 'data-info offer active' : 'data-info'}>
              <span className='status'>{prod.status}</span>
              <span>{dateToString(prod.date)}</span>
              <span>{'Shop'}</span>
            </div>
            <div className='buttons'>
              <div className='thumb-toggle visible' onClick={() => setThumbShow(!thumbShow)}>
                {thumbShow ? <LayersRoundedIcon className='icon'/> : <LayersClearRoundedIcon className='icon'/>}
              </div>
            </div>
          </div>
          {/* 画像 */}
          <Carousel className={thumbShow ? 'thumb-visible' : ''}
            showArrows={false} showStatus={false} infiniteLoop={false} showThumbs={true} selectedItem={currentIndex}
            emulateTouch={true} thumbWidth={50} onChange={handleChange}>
            {prod.imgs.map(img => (
              <div key={img}>
                <img src={img}/>
              </div>
            ))}
          </Carousel>
        </div>
        {compMode ?
          currentCompHistoryIndex !== undefined ?
            <div className='img-area comp'>
              <div className='features'>
                <div className={compMode && thumbCompShow ? buyStatus ? 'data-info buy active' : 'data-info offer active' : 'data-info'}>
                  <span className='status'>{prod.history && prod.history[currentCompHistoryIndex].status}</span>
                  <span>{prod.history && dateToString(prod.history[currentCompHistoryIndex].date)}</span>
                  <span>{prod.history && prod.history.length > 0 ? prod.history.length - currentCompHistoryIndex + '回前のユーザー' : 'Origin'}</span>
                </div>
                <div className='buttons'>
                  <div className='thumb-toggle visible' onClick={() => setThumbCompShow(!thumbCompShow)}>
                    {thumbCompShow ? <LayersRoundedIcon className='icon'/> : <LayersClearRoundedIcon className='icon'/>}
                  </div>
                </div>
              </div>
              {/* 比較画像 */}
              <Carousel className={thumbCompShow ? 'thumb-visible' : ''} 
                showArrows={false} showStatus={false} infiniteLoop={false} showThumbs={true} selectedItem={currentCompIndex} 
                emulateTouch={true} thumbWidth={50} onChange={handleCompChange}>
                {prod.history && prod.history[currentCompHistoryIndex].imgs.map(img => (
                  <div key={img}>
                    <img src={img}/>
                  </div>
                ))}
              </Carousel>
            </div>
          :
            <div className='img-area comp empty' onClick={() => setHistoryShow(!historyShow)}>
              <HighlightAltTwoToneIcon className='icon'/>
              <div className='empty-msg'>
                {'比較する履歴を\n選択してください'}
              </div>
            </div>
        :
        <div className='info-area'>
          {/* 購入・オファー */}
          <div className='info-buy'>
            {buyStatus ?
            <button className='buy now'>
              <div className='title'>購入</div>
              {prod.priceSale && <div className='price'>{currency(prod.priceSale)}</div>}
              <div className={prod.priceSale ? 'sale' : 'price'}>{currency(prod.price)}</div>
            </button>
            :
            <button className='buy offer'>
              <div className='title'>オファー</div>
              <div className={buyStatus ? 'price' : 'price offer'}>
                <input type='text' placeholder='金額を入力' value={'¥' + offerPrice.toLocaleString("ja-JP")} onChange={offerPriceHandler}/>
              </div>
            </button>
            }
            <Tooltip title={buyStatus ? 'オファーに変更' : '購入に変更'} placement="right-end" arrow>
              <button className={buyStatus ? 'status-toggle' : 'status-toggle turn'} onClick={() => setBuyStatus(!buyStatus)}>
                <HandshakeTwoToneIcon className={buyStatus ? 'icon' : 'icon turn'}/>
              </button>
            </Tooltip>
          </div>
          {/* コンディション */}
          <div className='condition'>
            <p>
              状態
            </p>
            <ul>
              {prodStatusList.map(status => 
                <li className={status === prod.status ? buyStatus ? 'active buy' : 'active offer' : ''} key={status}>
                  {status}
                </li>
              )}
            </ul>
          </div>
          {/* 商品サイズ */}
          <p>
            サイズ
          </p>
          <button className={prod.sizeImgIndex ? 'size-button active' : 'size-button'} onClick={() => prod.sizeImgIndex && setCurrentIndex(prod.sizeImgIndex)}>
            <FitScreenOutlinedIcon className='icon'/> サイズ画像を見る
          </button>
          <div className='info-detail'>
            {prod.size.map(size => 
              <div className='size'>
                <label>{size.name}</label>
                <span>{size.value}</span>
                <label>{size.unit}</label>
              </div>
            )}
          </div>
          {/* 商品詳細 */}
          <p>
            商品詳細
          </p>
          <ProductDefinition/>
          <p>
            人気推移
          </p>
          <div className='offer-data'>
            <img src='https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F1337870%2F051aa72c-6d8a-2528-4d57-f233021af234.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=81f03a92e54688318c204bd0f383752a' width={'100%'}/>
          </div>
          <p>
            お問い合わせ
          </p>
          <button className='contact-button'>
            <ContactSupportOutlinedIcon className='icon'/> 商品について質問
          </button>
        </div>
        }
      </div>
      <div className='recommends coordination'>
        <p>
          コディネート
        </p>
        <StyleCard styles={isSp ? recommendsStyleSp : recommendsStyle}/>
        <button className='more-button'>
          + もっと見る
        </button>
      </div>
      <div className='recommends items'>
        <p>
          関連アイテム
        </p>
        <ProductCard products={isSp ? recommendsSp : recommends}/>
        <button className='more-button'>
          + もっと見る
        </button>
      </div>
      <Guide/>
    </section>
    </>
  )
}