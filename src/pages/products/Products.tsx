import { MouseEvent, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchArea } from 'components/input/SearchInput';
import ProductCard from 'components/card/ProductCard';
import ProductService, { ProductFilter, ProductInfo } from 'api/service/ProductService';
import ClothesSprite from 'components/sprite/ClothesSprite';
import './Products.scss';

import TuneIcon from '@mui/icons-material/Tune';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Products() {
  const search = useLocation().search;
  const param = new URLSearchParams(search);
  
  const [dataList, setDataList] = useState<ProductInfo[]>([]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number|undefined>();
  const [maxPrice, setMaxPrice] = useState<number|undefined>();
  const [selectedBrands, setSelectedBrands] = useState<Array<string>>([]);
  const [selectedCategory, setSelectedCategory] = useState<Array<number>>([]);
  const [selectedStatus, setSelectedStatus] = useState<Array<number>>([]);
  const priceMaximum: number = 1000000;

  const productService = new ProductService();

  // 初期検索ワードがない場合、お勧め商品表示
  useEffect(() => {
    const getValue = param.get('v');
    if (!getValue) {
      const recommendFilter: ProductFilter = {
        // keyword: 'おしゃれ',
        // status: [5, 4]
      };
      getProductList(recommendFilter);
    }
  }, []);

  // 検索ワードがある場合、再検索を行う
  useEffect(() => {
    if (value) {
      getProductList();
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

  async function getProductList(recommendFilter?: ProductFilter) {
    setFilterOpen(false);
    const filter: ProductFilter = recommendFilter || {
      keyword: value,
      minPrice: minPrice,
      maxPrice: maxPrice,
      brands: selectedBrands,
      category: selectedCategory,
      status: selectedStatus
    };
    await productService.productList(filter).then(data => {
      const productListWithDateConverted = data.responseData.productList.map((product: ProductInfo) => ({
        ...product,
        date: new Date(product.date),
      }));
      setDataList(productListWithDateConverted);
    });
  }
  
  const handleSortItemClick = (value: string) => {
    switch (value) {
      case 'newest':
        setDataList([...dataList].sort((a, b) => b.date.getTime() - a.date.getTime()));
        break;
      case 'lastest':
        setDataList([...dataList].sort((a, b) => a.date.getTime() - b.date.getTime()));
        break;
      case 'lowest':
        setDataList([...dataList].sort((a, b) => {
          const priceA = a.priceSale ? a.priceSale : a.price;
          const priceB = b.priceSale ? b.priceSale : b.price;
          return priceA - priceB;
        }));
        break;
      case 'highest':
        setDataList([...dataList].sort((a, b) => {
          const priceA = a.priceSale ? a.priceSale : a.price;
          const priceB = b.priceSale ? b.priceSale : b.price;
          return priceB - priceA;
        }));
        break;
      default:
        setDataList([...dataList]);
        break;
    }
    setFilterOpen(false);
  };

  const handleClickFilter = (event: MouseEvent<HTMLElement>) => {
    setFilterOpen(!filterOpen);
  };

  interface SortData {
    sortName: string;
    value: string;
  }

  const sortList: SortData[] = [
    { sortName: '人気順', value: 'rate' },
    { sortName: '新着順', value: 'newest' },
    { sortName: '古い商品順', value: 'lastest' },
    { sortName: '価格が安い順', value: 'lowest' },
    { sortName: '価格が高い順', value: 'highest' },
  ]

  const brandMaster = {
    Nike: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/300px-Logo_NIKE.svg.png',
    Adidas: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Adidas_isologo.svg/300px-Adidas_isologo.svg.png',
    Converse: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Converse_logo.svg/300px-Converse_logo.svg.png',
    FILA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Fila_logo.svg/300px-Fila_logo.svg.png'
  }

  const categoryMaster = {
    10500: 'jaket', // その他
    10501: 'plain-shirt', //スニーカー
    10502: 'suit-shirt', // ブーツ
    10503: 'sweater', //フリップフロップ
    10504: 'short-round',
    10505: 'short-sleeve'
  }

  const statusMaster = [
    { key: 5, value: 'S' },
    { key: 4, value: 'A' },
    { key: 3, value: 'B' },
    { key: 2, value: 'C' },
    { key: 1, value: 'D' }
  ]

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setMinPrice(value <= priceMaximum ? value : priceMaximum);
    } else {
      setMinPrice(undefined);
    }
  };
  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setMaxPrice(value <= priceMaximum ? value : priceMaximum);
    } else {
      setMaxPrice(undefined);
    }
  };
  const brandClick = (brandKey: string) => {
    if (selectedBrands.includes(brandKey)) {
      setSelectedBrands(selectedBrands.filter(brand => brand !== brandKey));
    } else {
      setSelectedBrands([...selectedBrands, brandKey]);
    }
  };
  const categoryClick = (categoryKey: number) => {
    if (selectedCategory.includes(categoryKey)) {
      setSelectedCategory(selectedCategory.filter(category => category !== categoryKey));
    } else {
      setSelectedCategory([...selectedCategory, categoryKey]);
    }
  };
  const statusClick = (statusKey: number) => {
    if (selectedStatus.includes(statusKey)) {
      setSelectedStatus(selectedStatus.filter(status => status !== statusKey));
    } else {
      setSelectedStatus([...selectedStatus, statusKey]);
    }
  };
  const filterReset = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedCategory([]);
    setSelectedBrands([]);
    setSelectedStatus([]);
  };

  return(
    <>
    <section className='products'>
      <SearchArea value={value}/>
       {/* フィルター */}
      <div className='filter-area'>
        <div className={filterOpen ? 'filter-toggle active' : 'filter-toggle'} onClick={handleClickFilter}>
          <span className='title'>条件を追加</span>
          <ArrowDropDownIcon className={filterOpen ? 'icon active' : 'icon'}/>
        </div>
      </div>
      {/* フィルター詳細 */}
      <div className={filterOpen ? 'filter open' : 'filter'}>
        <div className='sort'>
          <label>並び替え</label>
          <div className='sort-item'>
            <select onChange={(e) => handleSortItemClick(e.target.value)}>
              {sortList.map((sort) => (
                <option value={sort.value} key={sort.value}>{sort.sortName}</option>
              ))}
            </select>
            <ArrowDropDownIcon className='icon'/>
          </div>
        </div>

        <div className='price'>
          <label>価格</label>
          <div className='price-range'>
            <input type='number' value={minPrice === undefined ? '' : minPrice} max={priceMaximum} onChange={handleMinChange} placeholder='0'/>
            <span> ~ </span>
            <input type='number' value={maxPrice === undefined ? '' : maxPrice} max={priceMaximum} onChange={handleMaxChange} placeholder='10000'/>
          </div>
        </div>

        <div className='brand'>
          <label>ブランド</label>
          <div className='quick-map'>
            {Object.entries(brandMaster).map(([brandKey, brandImg]) => (
              <div className={selectedBrands.includes(brandKey) ? 'brand-img active' : 'brand-img'} key={brandKey} onClick={() => brandClick(brandKey)}>
                <img src={brandImg}/>
              </div>
            ))}
          </div>
        </div>

        <div className='categorys'>
          <label>カテゴリー</label>
          <div className='quick-map'>
            {Object.entries(categoryMaster).map(([categoryKey, categoryIcon]) => (
              <div className={selectedCategory.includes(parseInt(categoryKey)) ? 'category active' : 'category'} key={categoryKey} onClick={() => categoryClick(parseInt(categoryKey))}>
                <span className='value'>{categoryKey}</span>
                <ClothesSprite id={categoryIcon} key={categoryIcon}/>
              </div>
            ))}
          </div>
        </div>

        <div className='status'>
          <label>状態</label>
          <div className='quick-map'>
            {statusMaster.map(status => (
              <div className={selectedStatus.includes(status.key) ? 'level active' : 'level'} key={status.key} onClick={() => statusClick(status.key)}>
                {status.value}
              </div>
            ))}
          </div>
        </div>
        
        <div className='buttons'>
          <button className='reset' onClick={() => filterReset()}>
            <span className='title'>条件クリア</span>
            <RestartAltIcon className='icon'/>
          </button>
          <button className='search' onClick={() => getProductList()}>
            <span className='title'>検索する</span>
            <TuneIcon className='icon'/>
          </button>
        </div>

      </div>
      {value ? 
      <>
        {/* 検索結果 */}
        <div className='menu-title'>
          <div className='sub'>Result</div>
          <div className='main'>
            <span className='key'>{value}</span> {dataList.length}件
          </div>
        </div>
        <ProductCard dataList={dataList}/>
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
        <ProductCard dataList={dataList}/>
        {/* おすすめ商品 */}
        <div className='menu-title'>
          <div className='sub'>Recommends</div>
          <div className='main'>おすすめアイテム</div>
        </div>
        <ProductCard dataList={dataList}/>
      </>
      }
    </section>
    </>
  )
}