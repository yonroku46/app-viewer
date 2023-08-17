import { MouseEvent, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchArea } from 'components/input/SearchInput';
import ProductCard from 'components/product/ProductCard';
import ProductService, { ProductFilter, ProductInfo } from 'api/service/ProductService';
import ClothesSprite from 'components/sprite/ClothesSprite';
import './Products.scss';

import FilterListSharpIcon from '@mui/icons-material/FilterListSharp';
import ExpandMoreSharpIcon from '@mui/icons-material/ExpandMoreSharp';
import { Menu, MenuItem } from '@mui/material';

export default function Products() {
  const search = useLocation().search;
  const param = new URLSearchParams(search);
  const [value, setValue] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const productService = new ProductService();

  useEffect(() => {
    const getValue = param.get('v');
    if (getValue) {
      setValue(getValue);
    } else {
      setValue('');
    }
  }, [param]);

  useEffect(() => {
    getProductList();
  }, []);

  async function getProductList() {
    const filter: ProductFilter = {
      keyword: value,
    };
    await productService.productList(filter).then(data => {
      setDataList(data.responseData.productList);
    });
  }

  const [dataList, setDataList] = useState<ProductInfo[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickFilter = (event: MouseEvent<HTMLElement>) => {
    setFilterOpen(!filterOpen);
  };

  const handleMenuItemClick = (event: MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const prodCategoryList: string[] = [
    'jaket', 'plain-shirt', 'suit-shirt', 'sweater', 'short-round', 'short-sleeve'
  ]

  const prodStatusList: string[] = [
    'S', 'A', 'B', 'C', 'D'
  ]

  interface SortData {
    sortName: string;
    value: string;
  }

  const sortList: SortData[] = [
    { sortName: '人気順', value: 'rate' },
    { sortName: '新着順', value: 'neweast' },
    { sortName: '古い商品順', value: 'lastest' },
    { sortName: '価格が安い順', value: 'highest' },
    { sortName: '価格が高い順', value: 'lowest' },
  ]

  const brandList: string[] = [
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_01_280x.png?v=1623244895',
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_02_280x.png?v=1623244895',
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_03_280x.png?v=1623244895',
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_04_280x.png?v=1623244895',
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_05_280x.png?v=1623244895',
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_06_280x.png?v=1623244895',
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_07_280x.png?v=1623244895',
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_08_280x.png?v=1623244895',
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_09_280x.png?v=1623244895',
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_10_280x.png?v=1623244895',
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_11_280x.png?v=1623244895',
    'https://estore.jeansmate.co.jp/cdn/shop/files/logo_12_280x.png?v=1623244895',
  ]

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
    },
    {
      productId: 6,
      liked: false,
      date: new Date(2023, 6, 1),
      name: 'Nike Air Zoom',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_21.jpg'],
      price: 9200,
      colors: ['green', 'pink'],
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
      productId: 7,
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
      productId: 8,
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
      productId: 9,
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
      productId: 10,
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
  ]

  return(
    <>
    <section className='products'>
      <SearchArea value={value}/>
       {/* フィルター */}
      <div className='filter-area'>
        <div onClick={handleClickFilter}>
          <span className='title'>フィルター</span>
          <FilterListSharpIcon className='icon'/>
        </div>
      </div>
      {/* フィルター詳細 */}
      <div className={filterOpen ? 'filter open' : 'filter'}>
        <div className='sort' onClick={handleClickListItem}>
          <label>並び替え</label>
          <div className='sort-item'>
            <span className='value'>{sortList[selectedIndex].sortName}</span>
            <ExpandMoreSharpIcon className='icon'/>
          </div>
        </div>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} 
          transformOrigin={{ horizontal: 'left', vertical: 'top' }} 
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
          {sortList.map((sort, index) => (
            <MenuItem className='sort-menu' key={sort.value} selected={index === selectedIndex} onClick={(event) => handleMenuItemClick(event, index)}>
              {sort.sortName}
            </MenuItem>
          ))}
        </Menu>

        <div className='price'>
          <label>価格</label>
          <div className='price-range'>
            <input placeholder='0'/>
            <span> ~ </span>
            <input placeholder='15000'/>
          </div>
        </div>

        <div className='brand'>
          <label>ブランド</label>
          <div className='quick-map'>
            {brandList.map((brand) => (
              <img src={brand} key={brand}/>
            ))}
          </div>
        </div>

        <div className='categorys'>
          <label>カテゴリー</label>
          <div className='quick-map'>
            {prodCategoryList.map(category => 
              <div className='category' key={category}>
                <ClothesSprite id={category} key={category}/>
              </div>
            )}
          </div>
        </div>

        <div className='status'>
          <label>状態</label>
          <div className='quick-map'>
            {prodStatusList.map(status => 
              <div className='level' key={status}>
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
      {value ? 
      <>
        {/* 検索結果 */}
        <div className='menu-title'>
          <div className='sub'>Result</div>
          <div className='main'>
            <span style={{ color: 'var(--main-color)' }}>"{value}"</span> {recommends.length}件
          </div>
        </div>
        <ProductCard dataList={recommends}/>
      </>
      :
      <>
        {/* 新着商品 */}
        <div className='menu-title'>
          <div className='sub'>New Arrivals</div>
          <div className='main'>新着</div>
        </div>
        <ProductCard dataList={dataList}/>
        {/* ランキング商品 */}
        <div className='menu-title'>
          <div className='sub'>Ranking</div>
          <div className='main'>人気アイテム</div>
        </div>
        <ProductCard dataList={recommends}/>
        {/* おすすめ商品 */}
        <div className='menu-title'>
          <div className='sub'>Recommends</div>
          <div className='main'>おすすめアイテム</div>
        </div>
        <ProductCard dataList={recommends}/>
      </>
      }
    </section>
    </>
  )
}