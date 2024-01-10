import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from 'components/card/ProductCard';
import { useMediaQuery } from 'react-responsive';
import { useWindowScroll } from 'react-use';
import SectionTitle from 'components/text/SectionTitle';
import ProductService, { ProductFilter, ProductInfo } from 'api/service/ProductService';
import FilterNav, { FilterMenuItem } from 'components/nav/FilterNav';
import Banner from 'components/banner/TopBanner';
import { currency } from "common/utils/StringUtils";
import './Products.scss';

import Slider from '@mui/material/Slider';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

export interface SortData {
  sortName: string;
  value: string;
}

export interface FilterData {
  gender: Array<string>,
  brands: Array<string>,
  category: Array<number>,
  status: Array<number>,
  colors: Array<string>,
  types: Array<string>
}

const sortList: Array<SortData> = [
  { sortName: '人気順', value: 'rate' },
  { sortName: '新着順', value: 'latest' },
  { sortName: '古い商品順', value: 'oldest' },
  { sortName: '価格が安い順', value: 'lowest' },
  { sortName: '価格が高い順', value: 'highest' },
]

export default function Products() {
  const isSp = useMediaQuery({ maxWidth: 767 });
  const location = useLocation();
  const search = location.search;
  const param = new URLSearchParams(search);
  
  const [load, setLoad] = useState<boolean>(true);
  const [fabShow, setFabShow] = useState<boolean>(false);
  const [isRecommend, setIsRecommend] = useState<boolean>(false);
  const [dataList, setDataList] = useState<ProductInfo[]>([]);
  const [value, setValue] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<FilterData>();
  const [selectedSort, setSelectedSort] = useState<string>(sortList[0].value);
  const [selectedSortName, setSelectedSortName] = useState<string>(sortList[0].sortName);

  const { y: windowY } = useWindowScroll();
  const spareArea: number = 100;

  const priceMaximum: number = 50000;
  const [price, setPrice] = useState<number[]>([0, priceMaximum]);
  const priceChange = (e: Event, selectPrice: number | number[]) => {
    const priceRange: Array<number> = selectPrice as number[];
    setPrice(priceRange);
  };

  const productService = ProductService();

  useEffect(() => {
    const initialSelectedItems: FilterData = {
      gender: [],
      brands: [],
      category: [],
      status: [],
      colors: [],
      types: [],
    };
    setSelectedItems(initialSelectedItems);
  }, []);

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
        getProductList();
      }
    } else {
      if (value === '') {
      const recommendFilter: ProductFilter = {
        keyword: '',
        status: [5, 4, 3, 2, 1]
      };
      getProductList(recommendFilter);
      }
    }
  }, [value]);

  useEffect(() => {
    if (windowY < spareArea) {
      setFabShow(true);
    } else {
      setFabShow(false);
    }
  }, [windowY]);

  async function getProductList(recommendFilter?: ProductFilter) {
    setLoad(true);
    setIsRecommend(!!recommendFilter);
    let filter: ProductFilter = recommendFilter || {
      keyword: value,
      minPrice: price[0],
      maxPrice: price[1],
      gender: selectedItems?.gender,
      brands: selectedItems?.brands,
      category: selectedItems?.category,
      status: selectedItems?.status,
      colors: selectedItems?.colors,
      types: selectedItems?.types
    };
    filter.sort = selectedSort;
    await productService.productList(filter).then(data => {
      const productListWithDateConverted = data.responseData.productList.map((product: ProductInfo) => ({
        ...product,
        date: new Date(product.date),
      }));
      setDataList(productListWithDateConverted);
      setLoad(false);
    });
  }
  
  function handleSortItemClick(value: string) {
    switch (value) {
      case 'rate':
        setDataList([...dataList].sort((a, b) => b.date.getTime() - a.date.getTime()));
        break;
      case 'latest':
        setDataList([...dataList].sort((a, b) => b.date.getTime() - a.date.getTime()));
        break;
      case 'oldest':
        setDataList([...dataList].sort((a, b) => a.date.getTime() - b.date.getTime()));
        break;
      case 'lowest':
        setDataList([...dataList].sort((a, b) => {
          const priceA = a.priceSale || a.price;
          const priceB = b.priceSale || b.price;
          return priceA - priceB;
        }));
        break;
      case 'highest':
        setDataList([...dataList].sort((a, b) => {
          const priceA = a.priceSale || a.price;
          const priceB = b.priceSale || b.price;
          return priceB - priceA;
        }));
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
  
  const menuItem: Array<FilterMenuItem> = [
    {
      category: 'カテゴリー',
      categoryValue: 'category',
      items: [
        { value: '10501', title: 'スニーカー'},
        { value: '10502', title: 'ブーツ'},
        { value: '10503', title: 'フリップフロップ'},
      ]
    },
    {
      category: '性別',
      categoryValue: 'gender',
      items: [
        { value: 'M', title: '男性'},
        { value: 'W', title: '女性'},
        { value: 'A', title: '兼用'},
      ]
    },
    {
      category: '状態',
      categoryValue: 'status',
      items: [
        { value: '5', title: 'S'},
        { value: '4', title: 'A'},
        { value: '3', title: 'B'},
        { value: '2', title: 'C'},
        { value: '1', title: 'D'},
      ]
    },
    {
      category: '価格',
      categoryValue: 'price',
      items: [
        { value: 'priceRange', title: '価格範囲', additional:
          <div className='slider'>
            <span>{currency(price[0] || 0)}</span> ~ <span>{currency(price[1] || priceMaximum)}</span>
            <Slider size='small' min={0} max={priceMaximum} step={1000} value={price} valueLabelDisplay="auto" onChange={priceChange}/>
          </div>
        }
      ]
    },
    {
      category: '価格タイプ',
      categoryValue: 'types',
      items: [
        { value: 'sale', title: 'セール価格'},
      ]
    },
    {
      category: 'カラー',
      categoryValue: 'colors',
      items: [
        { value: 'white', title: 'ホワイト' },
        { value: 'black', title: 'ブラック' },
        { value: 'gray', title: 'グレー' },
        { value: 'beige', title: 'ベージュ' },
        { value: 'brown', title: 'ブラウン' },
        { value: 'green', title: 'グリーン' },
        { value: 'blue', title: 'ブルー' },
        { value: 'purple', title: 'パープル' },
        { value: 'yellow', title: 'イエロー' },
        { value: 'pink', title: 'ピンク' },
        { value: 'red', title: 'レッド' },
        { value: 'orange', title: 'オレンジ' },
        { value: 'other', title: 'その他' }
      ]
    },
    {
      category: 'ブランド',
      categoryValue: 'brands',
      items: [
        { value: 'Nike', title: 'Nike' },
        { value: 'Adidas', title: 'Adidas' },
        { value: 'VANS', title: 'VANS' },
        { value: 'Converse', title: 'Converse' },
      ]
    },
  ]

  function handelMenu(data: FilterData) {
    setSelectedItems(data);
  };

  function reset() {
    setPrice([0, priceMaximum]);
  }

  function ViewHeader({ value, dataList, sortHandle, sortList }: { value: string, dataList: ProductInfo[], sortHandle: (value: string) => void, sortList: SortData[] }) {
    return (
      <div className='view-header'>
        {value ? 
          <SectionTitle main={value} count={dataList.length !== 0 ? dataList.length : 0}/>
          :
          isRecommend ?
            <SectionTitle main={'おすすめアイテム'} sub={'Recommends'}/>
          : selectedItems &&
            <SectionTitle count={dataList.length !== 0 ? dataList.length : 0}/>
        }
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

  return (
    <section className='products'>
      {/* <Banner background='' url=''/> */}
      <div className='product-view'>
        {isSp ?
          <>
            <FilterNav menuItem={menuItem} handelMenu={handelMenu} handleOk={() => getProductList()} isSp={isSp} fabShow={fabShow} reset={reset}/>
            <ViewHeader value={value} dataList={dataList} sortHandle={handleSortItemClick} sortList={sortList}/>
            <ProductCard dataList={dataList} loading={load}/>
          </>
          :
          <>
            <div className='left'>
              <FilterNav menuItem={menuItem} handelMenu={handelMenu} handleOk={() => getProductList()} isSp={isSp} reset={reset}/>
            </div>
            <div className='right'>
              <ViewHeader value={value} dataList={dataList} sortHandle={handleSortItemClick} sortList={sortList}/>
              <ProductCard dataList={dataList} loading={load}/>
            </div>
          </>
        }
      </div>
    </section>
  );
}