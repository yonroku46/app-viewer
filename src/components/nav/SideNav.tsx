import { useState, ReactElement, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './SideNav.scss';

export interface SideMenuItem {
  category: string;
  items: {
    value: string,
    link?: string | undefined,
    icon: ReactElement<any, any>,
    title: string
  }[];
}

export default function SideNav({ menuItem, additional, isSp }: { menuItem: SideMenuItem[], additional?: any, isSp: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string>('');

  useEffect(() => {
    if (!additional) {
      const currentPath = location.pathname;
      const path = currentPath.split('/')[2];
      setActiveMenu(path);
    }
  }, []);


  function menuClick(value: string, link: string | undefined) {
    setActiveMenu(value);
    if (link) {
      navigate(link);
    }
  }

  return(
    <>
    {/* サイドメニューコンポネント */}
    <nav className='side-nav'>
      <div className={isSp ? 'side-menu sp' : 'side-menu'}>
        {/* 追加要素エリア */}
        { additional }
        {/* タグ検索エリア */}
        {menuItem.map((menus) => (
          <div className='category' key={menus.category}>
          <div className='title'>
            {!isSp && menus.category}
          </div>
          <ul>
            {menus.items.map((menu) => (
            <li className={activeMenu === menu.value ? 'active icon' : 'icon'} onClick={() => menuClick(menu.value, menu.link)} key={menu.value}>
                {menu.icon}{!isSp && menu.title}
            </li>
            ))}
          </ul>
          </div>
        ))}
      </div>
    </nav>
    </>
  )
}