import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { useWindowScroll } from 'react-use';
import { Helmet } from 'react-helmet-async';
import { handleImgError } from "common/utils/ImgUtils";
import ProductCard from 'components/card/ProductCard';
import AuthService from 'api/service/AuthService';
import SocialService, { SocialFilter, SocialInfo, CommentInfo } from 'api/service/SocialService';
import ProductService, { ProductFilter, ProductInfo } from 'api/service/ProductService';
import SocialCard from 'components/card/SocialCard';
import Guide from 'components/guide/Guide';
import Empty from "components/empty/Empty";
import { showTopPopup } from "store/actions/popupActions";
import { loading, unloading } from "store/actions/loadingActions";
import { currency, calcDiscountRate, dateToString } from 'common/utils/StringUtils';
import { Carousel } from "react-responsive-carousel";
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
import KeyboardArrowRightSharpIcon from '@mui/icons-material/KeyboardArrowRightSharp';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

export default function ProductDetail() {
  const dispatch = useDispatch();
  const isSp = useMediaQuery({ maxWidth: 767 });
  const { id } = useParams();

  const authService = AuthService();
  const productService = ProductService();
  const socialService = SocialService();

  const { y: windowY } = useWindowScroll();
  const spareArea: number = 100;

  const [load, setLoad] = useState<boolean>(true);
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
  
  const [productList, setProductList] = useState<ProductInfo[]>([]);
  const [socialList, setSocialList] = useState<SocialInfo[]>([]);
  
  const prodStatusList = ['S','A','B','C','D']
  
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

  useEffect(() => {
    if (id) {
      const productId = parseInt(id);
      getProductInfo(productId);
      getProductList();
      getSocialList();
    }
  }, [id]);

  useEffect(() => {
    if (windowY > spareArea) {
      setFabShow(true);
    } else {
      setFabShow(false);
    }
  }, [windowY]);

  async function getProductInfo(productId: number) {
    dispatch(loading(false, true));
    setLoad(true);
    await productService.productInfo(productId).then(data => {
      if (data.responseData) {
        setProduct(data.responseData);
        getProductHistoryInfo(data.responseData.productId, data.responseData.history);
      }
    });
    dispatch(unloading());
    setLoad(false);
  }

  async function getProductHistoryInfo(productId: number, productIdList: Array<number>) {
    await productService.getProductHistoryInfo(productId, productIdList).then(data => {
      setProductHistory(data.responseData.productList);
    });
  }

  async function getProductList() {
    const filter: ProductFilter = {
      keyword: 'Nike',
      limit: 5
    };
    await productService.productList(filter).then(data => {
      setProductList(data.responseData.productList);
    });
  }

  async function getSocialList() {
    const filter: SocialFilter = {
      keyword: 'Summer',
      limit: 5
    };
    await socialService.socialList(filter).then(data => {
      setSocialList(data.responseData.socialList);
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
    window.scrollTo({ top: -100 });
  }

  function buyProduct() {
    console.log('buy', offerPrice)
  }

  function offerProduct(owner: number) {
    console.log(owner, 'with talk start', offerPrice)
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
            <span className='category-link' key={product.mainCategory}>
              <a href='#'>{product.mainCategory}</a>
            </span>
            {product.subCategory &&
              <span className='category-link' key={product.subCategory}>
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
                <span className='tag-link' key={tag}>
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

  if (load) {
    return(
      <section className='product-detail'/>
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
                    <img className='thumbnail' key={history.imgs[0]} src={history.imgs[0]} onError={handleImgError}/>
                    <div>
                      <div className='date'>{dateToString(history.date)}</div>
                      <div className='user'>{productHistory?.length - index + '回前のユーザー'}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <img className={productHistory?.length === 0 ? 'thumbnail disable' : 'thumbnail'} src={product.imgs[0]} onClick={() => setHistoryShow(!historyShow)} onError={handleImgError}/>
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
                  <img src={img} loading='eager' onError={handleImgError}/>
                </div>
              ))}
            </Carousel>
            {/* 購入・オファー */}
            {!compMode &&
              <div className='buy-area'>
                {buyStatus ?
                <button className='buy now' onClick={() => buyProduct()}>
                  <div className='title'>購入</div>
                  {product.priceSale && <div className='price'>{currency(product.priceSale)}</div>}
                  <div className={product.priceSale ? 'sale' : 'price'}>{currency(product.price)}</div>
                </button>
                :
                <button className='buy offer' onClick={() => offerProduct(product.owner)}>
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
                      <img src={img} loading='eager' onError={handleImgError}/>
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
              {/* 状態 */}
              <p>
                状態
                <InfoOutlinedIcon className='icon'/>
              </p>
              <div className='condition'>
                <ul>
                  {prodStatusList.map(status => 
                    <li className={status === product.status ? 'active ' + product.status : ''} key={status}>
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
          <div className='title'>
            コディネート
            <button className='more-btn'>
              <KeyboardArrowRightSharpIcon className='icon'/>
            </button>
          </div>
          <SocialCard dataList={socialList} loading={load} additional={false}/>
        </div>
        <div className='recommends items'>
          <div className='title'>
            関連アイテム
            <button className='more-btn'>
              <KeyboardArrowRightSharpIcon className='icon'/>
            </button>
          </div>
          <ProductCard dataList={productList} loading={load}/>
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