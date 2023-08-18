import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { useWindowScroll } from 'react-use';
import { Helmet } from 'react-helmet-async';
import ProductCard from 'components/product/ProductCard';
import AuthService from 'api/service/AuthService';
import ProductService, { ProductInfo } from 'api/service/ProductService';
import StyleCard, { StyleData } from 'components/style/StyleCard';
import Guide from 'components/guide/Guide';
import Empty from "components/empty/Empty";
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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Loading from 'components/backdrop/Loading';

export default function ProductDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSp = useMediaQuery({ maxWidth: 767 });
  const { id } = useParams();

  const authService = new AuthService();
  const productService = new ProductService();

  const { y: windowY } = useWindowScroll();
  const spareArea: number = 100;

  useEffect(() => {
    if (id) {
      const productId = parseInt(id);
      getProductInfo(productId);
    }
  }, []);

  useEffect(() => {
    if (windowY > spareArea) {
      setFabShow(true);
    } else {
      setFabShow(false);
    }
  }, [windowY]);

  async function getProductInfo(productId: number) {
    await productService.productInfo(productId).then(data => {
      setProduct(data.responseData);
      getProductHistoryInfo(data.responseData.productId, data.responseData.history);
    });
    setIsLoading(false);
  }

  async function getProductHistoryInfo(productId: number, productIdList: Array<number>) {
    await productService.getProductHistoryInfo(productId, productIdList).then(data => {
      setProductHistory(data.responseData.productList);
    });
  }

  async function productLike(productId: number, liked: boolean) {
    if (liked) {
      await productService.productLike(productId).then(data => {
        if (product) {
          setProduct(
            {...product, liked: liked}
          );
        }
      });
    } else {
      await productService.productUnlike(productId).then(data => {
        if (product) {
          setProduct(
            {...product, liked: liked}
          );
        }
      });
    }
  }

  const recommends: ProductInfo[] = [
    {
      productId: 1,
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
      gender: 'M',
      history: []
    },
    {
      productId: 2,
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
      gender: 'M',
      history: []
    },
    {
      productId: 3,
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
    gender: 'M',
    history: []
    },
    {
      productId: 4,
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
    gender: 'M',
    history: []
    },
    {
      productId: 5,
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
    gender: 'M',
    history: []
    }
  ]
  const recommendsSp: ProductInfo[] = recommends.slice();
  recommendsSp.push({
    productId: 6,
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
    gender: 'M',
    history: []
  });

  const recommendsStyle: StyleData[] = [
    {
      styleId: 101,
      liked: true,
      date: new Date(2023, 7, 18),
      profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_2.jpg',
      name: 'TestUser',
      imgs: ['https://jamtrading.jp/coordinate/wp-content/uploads/2023/08/oneday_logo1-375x540.jpg'],
      size: [
        {name: '身長', value: '172', unit: 'cm'},
      ],
      gender: 'M'
    },
    {
      styleId: 102,
      liked: true,
      date: new Date(2023, 7, 20),
      profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_2.jpg',
      name: 'TestUser',
      imgs: ['https://jamtrading.jp/coordinate/wp-content/uploads/2023/07/oneday_logo23-375x540.jpg'],
      size: [
        {name: '身長', value: '163', unit: 'cm'},
      ],
      gender: 'M',
    },
    {
      styleId: 103,
      liked: false,
      date: new Date(2023, 7, 18),
      profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_2.jpg',
      name: 'TestUser',
      imgs: ['	https://jamtrading.jp/coordinate/wp-content/uploads/2023/07/oneday_logo14-375x540.jpg'],
      size: [
      {name: '身長', value: '175', unit: 'cm'},
    ],
    gender: 'M',
    },
    {
      styleId: 104,
      liked: false,
      date: new Date(2023, 7, 17),
      profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_2.jpg',
      name: 'TestUser',
      imgs: ['https://jamtrading.jp/coordinate/wp-content/uploads/2023/07/oneday_logo17-375x540.jpg'],
      size: [
      {name: '身長', value: '180', unit: 'cm'},
    ],
    gender: 'M',
    },
    {
      styleId: 105,
      liked: false,
      date: new Date(2023, 6, 17),
      profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_2.jpg',
      name: 'TestUser',
      imgs: ['https://jamtrading.jp/coordinate/wp-content/uploads/2023/08/oneday_logo4-375x540.jpg'],
      size: [
      {name: '身長', value: '170', unit: 'cm'},
    ],
    gender: 'M',
    }
  ]
  const recommendsStyleSp: StyleData[] = recommendsStyle.slice();
  recommendsStyleSp.push({
    styleId: 106,
    liked: false,
    date: new Date(2023, 6, 17),
    profile: 'https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_10.jpg',
    name: 'SpUser',
    imgs: ['https://jamtrading.jp/coordinate/wp-content/uploads/2023/07/oneday_logo30-375x540.jpg'],
    size: [
      {name: '身長', value: '169', unit: 'cm'},
    ],
    gender: 'M',
  });


  const [product, setProduct] = useState<ProductInfo|undefined>(undefined);
  const [productHistory, setProductHistory] = useState<Array<ProductInfo>>([]);
  const [snapShow, setSnapShow] = useState<boolean>(true);
  const [thumbShow, setThumbShow] = useState<boolean>(true);
  const [thumbCompShow, setThumbCompShow] = useState<boolean>(true);
  const [historyShow, setHistoryShow] = useState<boolean>(false);
  const [fabShow, setFabShow] = useState<boolean>(false);
  const [buyStatus, setBuyStatus] = useState<boolean>(true);
  const [compMode, setCompMode] = useState<boolean>(false);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    setCurrentCompIndex(0);
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
  function snapToggle() {
    setSnapShow(!snapShow);
    if (snapShow) {
      setHistoryShow(false);
    }
  }
  
  function likeClick() {
    if (product) {
      if (authService.loginRequire()) {
        productLike(product.productId, !product.liked);
      }
    }
  }

  function share() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        dispatch(showTopPopup('URLをコピーしました'));
      }, (error) => {
        dispatch(showTopPopup('サポートしないブラウザです'));
      }
    );
  }

  function scrollToTop() {
    window.scrollTo({ top: 0 });
  }

  function ProductDefinition({ product }: { product: ProductInfo })  {
    return(
      <div className='definition'>
        <dl key='gender'>
          <dt>性別タイプ</dt>
          <dd>
            {product.gender === 'M' ? 'メンズ' : product.gender === 'W' ? 'レディース' : product.gender === 'A' ? '兼用' : ''}
          </dd>
        </dl>
        <dl key='category'>
          <dt>カテゴリー</dt>
          <dd>
            <span className='link' key={product.mainCategory}>
              <a href='#'>{product.mainCategory}</a>
            </span>
            {product.subCategory &&
              <span className='link' key={product.subCategory}>
                <a href='#'>{product.subCategory}</a>
              </span>
            }
          </dd>
        </dl>
        {product.additional &&
          Object.entries(product.additional).map(([additionalName, additionalValue]) => (
            <dl key={additionalName}>
              <dt>{additionalName}</dt>
              <dd>{additionalValue}</dd>
            </dl>
        ))}
        {product.brand &&
          <dl key='brand'>
            <dt>ブランド</dt>
            <dd>
              <span className='link' key={product.brand}>
                <a href='#'>{product.brand}</a>
              </span>
            </dd>
          </dl>
        }
        <dl key='colors'>
          <dt>カラー</dt>
          <dd>
            <div className='colors'>
              {product.colors.map((color) => (
                <Tooltip title={color} placement="top-end" key={color} arrow>
                  <span style={{ backgroundColor: color }}></span>
                </Tooltip>
              ))}
            </div>
          </dd>
        </dl>
        {product.tags?.length !== 0 &&
          <dl key='tags'>
            <dt>関連タグ</dt>
            <dd>
              {product.tags?.map(tag =>
                <span className='link' key={tag}>
                  <a href='#'>{tag}</a>
                </span>
              )}
            </dd>
          </dl>
        }
        <dl key='date'>
          <dt>登録日</dt>
          <dd>
            {dateToString(product.date)}
          </dd>
        </dl>
      </div>
    )
  }

  if (isLoading) {
    return(
      <section className='product-detail'>
        <Loading dark={true}/>
      </section>
    )
  }

  if (product) {
    return(
      <>
      <Helmet title={product ? product.name + ' - DadLabo' : 'DadLabo'}/>
      <section className='product-detail'>
        <Fab className={fabShow ? 'fab active' : 'fab'} size='small' onClick={() => scrollToTop()}>
          <NavigationRoundedIcon/>
        </Fab>
        {/* スナップ情報 */}
        <div className={snapShow ? 'snap-area active' : 'snap-area'}>
          <div className='snap'>
            <div className={productHistory?.length === 0 ? 'select-history disable' : historyShow ? 'select-history active' : 'select-history'}>
              <div className='thumbnail-list'>
                {productHistory?.length !== 0 && productHistory?.map((history, index) => 
                  <div className='thumbnail-data' onClick={() => handleHistoryChange(index)} key={index}>
                    <img className='thumbnail' key={history.imgs[0]} src={history.imgs[0]}/>
                    <div>
                      <div className='date'>{dateToString(history.date)}</div>
                      <div className='user'>{productHistory?.length - index + '回前のユーザー'}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <img className='thumbnail' src={product.imgs[0]} onClick={() => setHistoryShow(!historyShow)}/>
            <div className='top'>
              {productHistory?.length !== 0  &&
                <button className={compMode ? buyStatus ? 'comp buy active' : 'comp offer active' : 'comp'} onClick={() => compToggle()}>
                  {compMode ? <CollectionsTwoToneIcon className='icon'/> : <LibraryAddCheckTwoToneIcon className='icon'/>}
                </button>
              }
              <button className={product.liked ? 'like liked' : 'like'} onClick={() => likeClick()}>
                <StarRoundedIcon className='icon'/>
              </button>
              <button className='share' onClick={() => share()}>
                <ShareTwoToneIcon className='icon'/>
              </button>
              {product.priceSale && buyStatus &&
                <div className='sale-label'>
                  <span>
                    {calcDiscountRate(product.price, product.priceSale) + 'OFF'}
                  </span>
                </div>
              }
              <div className={product.priceSale && buyStatus ? 'name' : 'name not-sale'}>
                {product.name}
              </div>
            </div>
          </div>
        </div>
        <div className={snapShow ? 'snap-toggle active' : 'snap-toggle'} onClick={() => snapToggle()}>
          <KeyboardArrowRightIcon className={snapShow ? 'icon active' : 'icon inactive'}/>
        </div>
        {/* 詳細情報 */}
        <div className={snapShow ? 'product' : 'product hide'}>
          <div className={snapShow ? (isSp && compMode) ? 'img-area comp' : 'img-area' : (isSp && compMode) ? 'img-area snap-hide comp' : 'img-area snap-hide'}>
            <div className='features'>
              <div className={compMode && thumbShow ? buyStatus ? 'data-info buy active' : 'data-info offer active' : 'data-info'}>
                <span className='status'>{product.status}</span>
                <span>{dateToString(product.date)}</span>
                <span>{'ショップ'}</span>
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
              {product.imgs.map(img => (
                <div key={img}>
                  <img src={img} loading='eager'/>
                </div>
              ))}
            </Carousel>
            {/* 購入・オファー */}
            {!compMode &&
              <div className='buy-area'>
                {buyStatus ?
                <button className='buy now'>
                  <div className='title'>購入</div>
                  {product.priceSale && <div className='price'>{currency(product.priceSale)}</div>}
                  <div className={product.priceSale ? 'sale' : 'price'}>{currency(product.price)}</div>
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
            }
          </div>
          {compMode ?
            currentCompHistoryIndex !== undefined ?
              <div className='img-area comp'>
                <div className='features'>
                  <div className={compMode && thumbCompShow ? buyStatus ? 'data-info buy active' : 'data-info offer active' : 'data-info'}>
                    <span className='status'>{productHistory && productHistory[currentCompHistoryIndex].status}</span>
                    <span>{productHistory && dateToString(productHistory[currentCompHistoryIndex].date)}</span>
                    <span>{productHistory?.length > 0 ? productHistory.length - currentCompHistoryIndex + '回前のユーザー' : 'Origin'}</span>
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
                  {productHistory && productHistory[currentCompHistoryIndex].imgs.map(img => (
                    <div key={img}>
                      <img src={img} loading='eager'/>
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
              {/* コンディション */}
              <div className='condition'>
                <p>
                  状態
                  <InfoOutlinedIcon className='icon'/>
                </p>
                <ul>
                  {prodStatusList.map(status => 
                    <li className={status === product.status ? buyStatus ? 'active buy' : 'active offer' : ''} key={status}>
                      {status}
                    </li>
                  )}
                </ul>
              </div>
              {/* 商品サイズ */}
              <p>
                サイズ
                <InfoOutlinedIcon className='icon'/>
              </p>
              <button className={product.sizeIdx ? 'size-btn active' : 'size-btn'} onClick={() => product.sizeIdx && setCurrentIndex(product.sizeIdx)}>
                <FitScreenOutlinedIcon className='icon'/> サイズ画像を見る
              </button>
              <div className='info-detail'>
                {product.size &&
                  Object.entries(product.size).map(([sizeName, sizeValue]) => (
                    <div className='size' key={sizeName}>
                      <label>{sizeName}</label>
                      <span>{sizeValue}</span>
                      <label>cm</label>
                    </div>
                ))}
              </div>
              {/* 商品詳細 */}
              <p>
                商品詳細
              </p>
              <ProductDefinition product={product}/>
              <p>
                人気推移
              </p>
              <div className='offer-data'>
                <img src='https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F1337870%2F051aa72c-6d8a-2528-4d57-f233021af234.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=81f03a92e54688318c204bd0f383752a' width={'100%'}/>
              </div>
              <p>
                お問い合わせ
              </p>
              <button className='contact-btn'>
                <ContactSupportOutlinedIcon className='icon'/> 商品について質問
              </button>
            </div>
          }
        </div>
        <div className='recommends coordination'>
          <p>
            コディネート
          </p>
          <StyleCard dataList={isSp ? recommendsStyleSp : recommendsStyle}/>
          <button className='more-btn'>
            + もっと見る
          </button>
        </div>
        <div className='recommends items'>
          <p>
            関連アイテム
          </p>
          <ProductCard dataList={isSp ? recommendsSp : recommends}/>
          <button className='more-btn'>
            + もっと見る
          </button>
        </div>
        <Guide/>
      </section>
      </>
    )
  } else {
    return (
      <Empty/>
    )
  }
}