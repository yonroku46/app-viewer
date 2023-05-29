import { useState, ReactElement } from 'react';
import './SearchNav.scss';

export interface SearchMenuItem {
  category: string;
  items: {
    id: number,
    value: string,
    icon: ReactElement<any, any>,
    title: string
  }[];
}

export default function SearchNav({ menuItem, isSp }: { menuItem: SearchMenuItem[], isSp: boolean }) {

  const [activeMenu, setActiveMenu] = useState<string>();

  return(
    <>
    {/* 検索サポートコンポネント */}
    <nav className='search-nav'>
        <div className={isSp ? 'side-menu sp' : 'side-menu'}>
        {menuItem.map((menus) => (
            <div className='category'>
            <div className='title'>
                {!isSp && menus.category}
            </div>
            <ul>
                {menus.items.map((menu) => (
                <li className={activeMenu === menu.value ? 'active' : ''} onClick={() => setActiveMenu(menu.value)} key={menu.id}>
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