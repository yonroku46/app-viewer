import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { ProductData } from 'components/product/ProductCard';
import { currency, calcDiscountRate } from 'common/utils/StringUtils';
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Products.scss';

import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';
import BookmarkTwoToneIcon from '@mui/icons-material/BookmarkTwoTone';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';

export default function ProductDetail() {
  const navigate = useNavigate();
  const isSp = useMediaQuery({ maxWidth: 767 });
  const { id } = useParams();

  const [buyStatus, setBuyStatus] = useState<boolean>(true);
  const [offerPrice, setOfferPrice] = useState<number>(0);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  function handleChange(index: number) {
    setCurrentIndex(index);
  }

  const offerPriceHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(inputValue, 10);
    setOfferPrice(isNaN(numericValue) ? 0 : numericValue);
  }

  const prod: ProductData = {
    id: 1,
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
      'https://minimal-kit-react.vercel.app/assets/images/products/product_10.jpg',
    ],
    price: 5000,
    priceSale: 3000,
    colors: ['green', 'white', 'red', 'gray', 'yellow'],
  };

  function createData(
    user: string,
    price: number,
    date: string,
  ) {
    return { user, price, date };
  }
  
  const historyList = [
    createData('サザエさん', 5000, '2023-07-14'),
    createData('マスオ', 3200, '2023-07-13'),
    createData('ノリスケ', 2000, '2023-07-12'),
    createData('ワカメ', 1200, '2023-07-11'),
    createData('タラオ', 1000, '2023-07-01'),
  ];

  function HistoryTable() {
    return (
      <TableContainer className='history-table' component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>購入者</TableCell>
              <TableCell align="right">価格</TableCell>
              <TableCell align="right">日付</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyList.map((row) => (
              <TableRow key={row.user} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell scope="row">
                  {row.user}
                </TableCell>
                <TableCell align="right">{currency(row.price)}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return(
    <>
    <section className='product-detail'>
      <div className='product'>
        {/* 画像情報 */}
        <div className='img-area'>
          <Carousel showArrows={true} showStatus={false} infiniteLoop={true} showThumbs={true} selectedItem={currentIndex} emulateTouch={true} onChange={handleChange}>
            {prod.imgs.map(img => (
              <div key={img}>
                <img src={img}/>
              </div>
            ))}
          </Carousel>
        </div>
        {/* 詳細情報 */}
        <div className='info-area'>
          <div className='top'>
            <button className='share'>
              <ShareTwoToneIcon className='icon'/>
            </button>
            <div className='title'>
              {'Title'}
            </div>
            <div className='name'>
              {prod.name}
            </div>
          </div>
          {prod.priceSale &&
            <div className='sale-label'>
              <span>
                {calcDiscountRate(prod.price, prod.priceSale) + 'OFF'}
              </span>
            </div>
          }
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
          {/* 商品ステータス */}
          <div className='info-detail'>
            <div className='browsed'>
              <label>閲覧数</label>
              <span>{'1.5K'}</span>
            </div>
            <div className='offer-num'>
              <label>オファー数</label>
              <span>{'20'}</span>
            </div>
            <div className='used'>
              <label>購入履歴</label>
              <span>{historyList.length}</span>
            </div>
          </div>
          {/* 商品詳細 */}
          <p>商品詳細</p>
          <div className='definition'>
            <dl key='1'>
              <dt>素材</dt>
              <dd>コットン100%</dd>
            </dl>
            <dl key='2'>
              <dt>サイズ</dt>
              <dd>95</dd>
            </dl>
            <dl key='3'>
              <dt>性別タイプ</dt>
              <dd>メンズ・レディース</dd>
            </dl>
            <dl key='4'>
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
            <dl key='5'>
              <dt>関連タグ</dt>
              <dd>おしゃれ / 夏服 / 新品</dd>
            </dl>
            <dl key='6'>
              <dt>登録日</dt>
              <dd>2023/07/14</dd>
            </dl>
          </div>
          {/* 履歴 */}
          <p>履歴</p>
          <div className='history'>
            <HistoryTable/>
          </div>
          <p>オファー推移</p>
          <div className='history'>
            <img src='https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.ap-northeast-1.amazonaws.com%2F0%2F1337870%2F051aa72c-6d8a-2528-4d57-f233021af234.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=81f03a92e54688318c204bd0f383752a' width={'100%'}/>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}