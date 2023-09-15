import { MouseEvent, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchArea } from 'components/input/SearchInput';
import ProductCard from 'components/card/ProductCard';
import SectionTitle from 'components/text/SectionTitle';
import ClothesSprite from 'components/sprite/ClothesSprite';
import Modal from 'components/modal/Modal';
import ProductService, { ProductFilter, ProductInfo } from 'api/service/ProductService';
import './Products.scss';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function Products() {
  const location = useLocation();
  const search = location.search;
  const param = new URLSearchParams(search);
  
  const [load, setLoad] = useState<boolean>(true);
  const [dataList, setDataList] = useState<ProductInfo[]>([]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number|undefined>();
  const [maxPrice, setMaxPrice] = useState<number|undefined>();
  const [selectedBrands, setSelectedBrands] = useState<Array<string>>([]);
  const [selectedCategory, setSelectedCategory] = useState<Array<number>>([]);
  const [selectedStatus, setSelectedStatus] = useState<Array<number>>([]);
  const [modalType, setModalType] = useState<string>('');
  const [modalData, setModalData] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const priceMaximum: number = 1000000;

  const productService = ProductService();

  // パラメータ設定
  useEffect(() => {
    const getValue = param.get('v');
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

  async function getProductList(recommendFilter?: ProductFilter) {
    setFilterOpen(false);
    setLoad(true);
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
      setLoad(false);
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

  const handleClickFilter = (e: MouseEvent<HTMLElement>) => {
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
  }

  const statusMaster = [
    { key: 5, value: 'S' },
    { key: 4, value: 'A' },
    { key: 3, value: 'B' },
    { key: 2, value: 'C' },
    { key: 1, value: 'D' }
  ]

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setMinPrice(value <= priceMaximum ? value : priceMaximum);
    } else {
      setMinPrice(undefined);
    }
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
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

  function handleModalOpen(type: string) {
    setModalType(type);
    if (type === 'brand') {
      setModalData(brandMaster);
    } else if (type === 'category') {
      setModalData(categoryMaster);
    }
    setModalOpen(true);
  };

  function handleModalClose() {
    setModalOpen(false);
  };

  return(
    <>
    <Modal type={modalType} data={modalData} open={modalOpen} onClose={handleModalClose}/>
    <section className='products'>
      <SearchArea value={value}/>
       {/* フィルター */}
      {/* <div className='filter-area'>
        <div className='filter-toggle' onClick={handleClickFilter}>
          <span className='title'>条件を追加</span>
          <ArrowDropDownIcon className={filterOpen ? 'icon active' : 'icon'}/>
        </div>
      </div> */}
      {/* フィルター詳細 */}
      {/* <div className={filterOpen ? 'filter open' : 'filter'}>
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
            <div className='brand-img' key={'more'} onClick={() => handleModalOpen('brand')}>
              <MoreHorizIcon className='icon'/>
              <span className='value'>もっと見る</span>
            </div>
          </div>
        </div>

        <div className='categorys'>
          <label>カテゴリー</label>
          <div className='quick-map'>
            {Object.entries(categoryMaster).map(([categoryKey, categoryIcon]) => (
              <div className={selectedCategory.includes(parseInt(categoryKey)) ? 'category active' : 'category'} key={categoryKey} onClick={() => categoryClick(parseInt(categoryKey))}>
                <ClothesSprite id={categoryIcon} key={categoryIcon}/>
                <span className='value'>{categoryKey}</span>
              </div>
            ))}
            <div className='category' key={'more'} onClick={() => handleModalOpen('category')}>
              <MoreHorizIcon className='icon'/>
              <span className='value'>もっと見る</span>
            </div>
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
            <span>リセット</span>
          </button>
          <button className='search' onClick={() => getProductList()}>
            <span>上記の条件で検索</span>
          </button>
        </div>

      </div> */}
      {value ? 
        <SectionTitle main={value} count={dataList.length !== 0 ? dataList.length : 0}/>
        :
        <SectionTitle main={'おすすめアイテム'} sub={'Recommends'}/>
      }
      <ProductCard dataList={dataList} loading={load}/>
    </section>
    </>
  )
}