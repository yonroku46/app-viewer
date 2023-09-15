import { useState, ReactElement, useEffect, Dispatch, SetStateAction } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './SideNav.scss';

import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import Tooltip from '@mui/material/Tooltip';

export interface SideMenuItem {
  category: string;
  items: {
    value: string,
    link?: string | undefined,
    icon: ReactElement<any, any>,
    title: string
  }[];
}

export default function SideNav({ menuItem, fold, setFold }: { menuItem: SideMenuItem[], fold: boolean, setFold?: Dispatch<SetStateAction<boolean>> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string>('');

  useEffect(() => {
    const currentPath = location.pathname;
    const path = currentPath.split('/')[3];
    setActiveMenu(path);
  }, [location]);


  function menuClick(value: string, link: string | undefined) {
    setActiveMenu(value);
    if (link) {
      navigate(link);
    }
  }

  return(
    <>
    {/* サイドメニューコンポネント */}
    <div className='side-nav'>
      <div className={fold ? 'side-menu sp' : 'side-menu'}>
        {/* メニュー要素エリア */}
        {menuItem.map((menus) => (
          <div className='category' key={menus.category}>
          <div className='title'>
            {!fold && menus.category}
          </div>
          <ul>
            {menus.items.map((menu) => (fold ?
            <Tooltip title={menu.title} placement="right-end" arrow>
              <li className={activeMenu === menu.value ? 'active icon' : 'icon'} onClick={() => menuClick(menu.value, menu.link)} key={menu.value}>
                {menu.icon}{!fold && menu.title}
              </li>
            </Tooltip>
            :
            <li className={activeMenu === menu.value ? 'active icon' : 'icon'} onClick={() => menuClick(menu.value, menu.link)} key={menu.value}>
              {menu.icon}{!fold && menu.title}
            </li>
            ))}
          </ul>
          </div>
        ))}
        {setFold && 
        <Tooltip title={fold ? '最大化' : '最小化'} placement="right-end" arrow>
          <button className='fold-toggle' onClick={() => setFold(!fold)}>
            {fold ? <OpenInFullIcon/> : <CloseFullscreenIcon/>}
          </button>
        </Tooltip>
        }
      </div>
    </div>
    </>
  )
}