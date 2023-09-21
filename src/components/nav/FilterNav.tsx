import { MouseEvent, useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { FilterData } from 'pages/products/Products';
import './FilterNav.scss';

import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import ReplayIcon from '@mui/icons-material/Replay';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';

export interface FilterMenuItem {
  category: string;
  categoryValue: string;
  items: {
    value: string,
    title: string,
    additional?: any
  }[];
}

export default function FilterNav({ menuItem, handelMenu, isSp, reset }: { menuItem: FilterMenuItem[], handelMenu: (data: FilterData) => void, isSp: boolean, reset: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({});
  const [checkboxState, setCheckboxState] = useState<{ [key: string]: { [key: string]: boolean } }>({});
  const [changeFilter, setChangeFilter] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  
  const initialOpenMenuList: Array<string> = ['カテゴリー', '性別', '状態', '価格'];

  useEffect(() => {
    childReset();
  }, []);

  function toggleCategory(category: string) {
    setOpenState((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }

  function toggleCheckbox(category: string, value: string) {
    // チェック処理
    setChangeFilter(true);
    const newCheckboxState = {
      ...checkboxState,
      [category]: {
        ...checkboxState[category],
        [value]: !checkboxState[category][value],
      },
    };
    setCheckboxState(newCheckboxState);
    // 親コンポネントに転送
    const selectedItems = menuItem.reduce((result: any, menu: any) => {
      result[menu.categoryValue] = Object.keys(newCheckboxState[menu.category])
        .filter((item) => newCheckboxState[menu.category][item]);
      return result;
    }, {} as FilterData);
    handelMenu(selectedItems);
  }

  function childReset() {
    const initialOpenState: { [key: string]: boolean } = {};
    const initialCheckboxState: { [key: string]: { [key: string]: boolean } } = {};
    for (const menus of menuItem) {
      if (initialOpenMenuList.includes(menus.category)) {
        initialOpenState[menus.category] = true;
      }
      initialCheckboxState[menus.category] = {};
      if (menus.category !== '価格') {
        for (const menu of menus.items) {
          initialCheckboxState[menus.category][menu.value] = false;
        }
      }
    }
    setOpenState(initialOpenState);
    setCheckboxState(initialCheckboxState);
  }

  function resetClick() {
    childReset();
    reset();
    setChangeFilter(false);
  }

  if (isSp) {
    return(
      <div className='filter-nav-sp'>
        <div className='filter-menu'>
          {/* イベント要素エリア */}
          <div className='additional'>
            <div className={changeFilter ? 'reset sp active' : 'reset sp'} onClick={resetClick}>
              クリアー<ReplayIcon className='icon'/>
            </div>
            <div className='filter-toggle' onClick={() => setOpenFilter(!openFilter)}>
              {openFilter ? 'フィルター非表示' : 'フィルター表示'}
              <KeyboardArrowDownSharpIcon className={openFilter ? 'icon active' : 'icon'}/>
            </div>
          </div>
          {/* メニュー要素エリア */}
          {openFilter && menuItem.map((menus) => (
            <div className='category' key={menus.category}>
              <div className='title' onClick={() => toggleCategory(menus.category)}>
                {menus.category}
                {openState[menus.category] ?
                  <RemoveSharpIcon className='icon'/>
                  :
                  <AddSharpIcon className='icon'/>
                }
              </div>
              <ul className={openState[menus.category] ? 'open scroll' : 'closed'}>
                {menus.items.map((menu) => (
                  <li onClick={() => toggleCheckbox(menus.category, menu.value)} key={menu.value}>
                    {menu.additional ?
                      menu.additional
                    :
                    <>
                      <input type='checkbox' checked={checkboxState[menus.category] && checkboxState[menus.category][menu.value] || false} onChange={() => {}}/>
                      {menu.title}
                      {menus.categoryValue === 'colors' && <span className='color' style={{background: menu.value === 'other' ? 
                        'linear-gradient(to bottom right, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8A2BE2)' : menu.value}}></span>}
                    </>
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return(
    <>
    {/* サイドメニューコンポネント */}
    <div className='filter-nav'>
      <div className='filter-menu'>
        <div className={changeFilter ? 'reset active' : 'reset'} onClick={resetClick}>
          クリアー<ReplayIcon className='icon'/>
        </div>
        {/* メニュー要素エリア */}
        {menuItem.map((menus) => (
          <div className='category' key={menus.category}>
            <div className='title' onClick={() => toggleCategory(menus.category)}>
              {menus.category}
              {openState[menus.category] ?
                <RemoveSharpIcon className='icon'/>
                :
                <AddSharpIcon className='icon'/>
              }
            </div>
            <ul className={openState[menus.category] ? 'open scroll' : 'closed'}>
              {menus.items.map((menu) => (
                <li onClick={() => toggleCheckbox(menus.category, menu.value)} key={menu.value}>
                  {menu.additional ?
                    menu.additional
                  :
                  <>
                    <input type='checkbox' checked={checkboxState[menus.category] && checkboxState[menus.category][menu.value] || false} onChange={() => {}}/>
                    {menu.title}
                    {menus.categoryValue === 'colors' && <span className='color' style={{background: menu.value === 'other' ? 
                      'linear-gradient(to bottom right, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8A2BE2)' : menu.value}}></span>}
                  </>
                  }
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}