import { useState, useEffect } from 'react';
import { FilterData } from 'pages/products/Products';
import './FilterNav.scss';

import Fab from '@mui/material/Fab';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';

export interface FilterMenuItem {
  category: string;
  categoryValue: string;
  items: {
    value: string,
    title: string,
    additional?: any
  }[];
}

export default function FilterNav({ menuItem, handelMenu, handleOk, isSp, fabShow, reset }: { menuItem: FilterMenuItem[], handelMenu: (data: FilterData) => void, handleOk: () => void, isSp: boolean, fabShow?: boolean, reset: () => void }) {
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

  function okClick() {
    handleOk();
    if (isSp) {
      setOpenFilter(false);
    }
  }

  return(
    <>
    {/* サイドメニューコンポネント */}
    <div className={isSp ? 'filter-nav-sp' : 'filter-nav'}>
      {isSp &&
        <Fab className={fabShow ? 'fab active' : 'fab'} size='small' onClick={() => setOpenFilter(!openFilter)}>
          <ManageSearchRoundedIcon/>
        </Fab>
      }
      <div className='filter-menu'>
        {/* メニュー要素エリア */}
        {(openFilter || !isSp) && 
          <>
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
          <div className='buttons'>
            <button className={changeFilter ? 'reset active' : 'reset disable'} onClick={resetClick}>クリアー</button>
            <button className='ok' onClick={okClick}>OK</button>
          </div>
          </>
        }
      </div>
    </div>
    </>
  )
}