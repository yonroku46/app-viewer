import { MouseEvent, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchArea } from 'components/input/SearchInput';
import ProductCard, { ProductData } from 'components/product/ProductCard';
import './Products.scss';

import FilterListSharpIcon from '@mui/icons-material/FilterListSharp';
import ExpandMoreSharpIcon from '@mui/icons-material/ExpandMoreSharp';
import { Menu, MenuItem } from '@mui/material';

export default function Products() {
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const getValue = query.get('v');
    if (getValue) {
      setValue(getValue);
    } else {
      setValue('');
    }
  }, [query]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event: MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  interface SortData {
    sortName: string;
    value: string;
  }

  const sortList: SortData[] = [
    { sortName: '新しい順', value: 'neweast' },
    { sortName: '古い順', value: 'lastest' },
    { sortName: '料金が高い順', value: 'highest' },
    { sortName: '料金が安い順', value: 'lowest' },
    { sortName: '評価が高い順', value: 'rate' },
  ]

  const recommends: ProductData[] = [
    {
      id: 1,
      date: new Date(2023, 6, 13),
      name: 'Nike Air Force',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_1.jpg'],
      price: 5000,
      priceSale: 3000,
      status: 'sale',
      colors: ['green', 'white'],
    },
    {
      id: 2,
      date: new Date(2023, 6, 14),
      name: 'Nike Space Hippie 04 SUPER Edition',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_2.jpg'],
      price: 10200,
      status: 'new',
      colors: ['lightgray', 'orange'],
    },
    {
      id: 3,
      date: new Date(2023, 6, 15),
      name: 'Nike Air Max Zephyr',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_7.jpg'],
      price: 8900,
      colors: ['green', 'red'],
    },
    {
      id: 4,
      date: new Date(2023, 6, 16),
      name: 'Jodern Delta',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_8.jpg'],
      price: 10200,
      colors: ['yellowgreen', 'blue'],
    },
    {
      id: 5,
      date: new Date(2023, 6, 17),
      name: 'Nike Air Max Up',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_17.jpg'],
      price: 9200,
      colors: ['white', 'pink'],
    },
    {
      id: 6,
      date: new Date(2023, 6, 1),
      name: 'Nike Air Zoom',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_21.jpg'],
      price: 9200,
      colors: ['green', 'pink'],
    },
  ]

  const products: ProductData[] = [
    {
      id: 11,
      date: new Date(2023, 7, 13),
      name: 'Nike ZoomX Super',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_5.jpg'],
      price: 5000,
      priceSale: 1000,
      colors: ['orange', 'black', 'red', 'yellow'],
    },
    {
      id: 12,
      date: new Date(2023, 7, 14),
      name: 'Nike ZoomX:Re',
      imgs: ['https://minimal-kit-react.vercel.app/assets/images/products/product_3.jpg'],
      price: 5000,
      colors: ['lightgray'],
    },
  ]

  return(
    <>
    <section className='products'>
      <SearchArea value={value}/>
      {value ? 
      <>
      {/* 検索結果 */}
      <div className='filter-area'>
        <div>
          <span className='title'>フィルター</span>
          <FilterListSharpIcon className='icon'/>
        </div>
        <div onClick={handleClickListItem}>
          <span className='title'>ソート：</span>
          <span className='value'>{sortList[selectedIndex].sortName}</span>
          <ExpandMoreSharpIcon className='icon'/>
        </div>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} 
          transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          {sortList.map((sort, index) => (
            <MenuItem className='sort-menu' key={sort.value} selected={index === selectedIndex} onClick={(event) => handleMenuItemClick(event, index)}>
              {sort.sortName}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div className='menu-title'>
        <div className='sub'>Result</div>
        <div className='main'><span style={{ color: 'var(--main-color)' }}>"{value}"</span> {recommends.length}件</div>
      </div>
      <ProductCard products={recommends}/>
      </>
      :
      <>
      {/* フィルター */}
      <div className='filter-area'>
        <div>
          <span className='title'>フィルター</span>
          <FilterListSharpIcon className='icon'/>
        </div>
        <div onClick={handleClickListItem}>
          <span className='title'>ソート：</span>
          <span className='value'>{sortList[selectedIndex].sortName}</span>
          <ExpandMoreSharpIcon className='icon'/>
        </div>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} 
          transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          {sortList.map((sort, index) => (
            <MenuItem className='sort-menu' key={sort.value} selected={index === selectedIndex} onClick={(event) => handleMenuItemClick(event, index)}>
              {sort.sortName}
            </MenuItem>
          ))}
        </Menu>
      </div>
      {/* 新着商品 */}
      <div className='menu-title'>
        <div className='sub'>New Arrivals</div>
        <div className='main'>新着</div>
      </div>
      <ProductCard products={products}/>
      {/* ランキング商品 */}
      <div className='menu-title'>
        <div className='sub'>Ranking</div>
        <div className='main'>人気アイテム</div>
      </div>
      <ProductCard products={recommends}/>
      {/* おすすめ商品 */}
      <div className='menu-title'>
        <div className='sub'>Recommends</div>
        <div className='main'>おすすめアイテム</div>
      </div>
      <ProductCard products={recommends}/>
      </>
      }
    </section>
    </>
  )
}