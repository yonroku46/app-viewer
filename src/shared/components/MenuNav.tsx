import { useState, ReactElement } from 'react';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import AuthService from '../../shared/service/AuthService';
import { imgSrc, handleImgError } from "../../shared/utils/Utils";
import { RiArrowDropRightLine } from "react-icons/ri";
import './MenuNav.scss';

export interface MenuItem {
  category: string;
  items: {
    id: number,
    url: string,
    icon: ReactElement<any, any>,
    title: string
  }[];
}

export default function MenuNav({ menuItem, currentPath, userName, mail }: { menuItem: MenuItem[], currentPath: string | undefined, userName: string | undefined, mail: string | undefined }) {
  const isSp = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  const authService = new AuthService();

  const [open, setOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>(menuItem[0].category);

  async function logout() {
    await authService.logout(true).then(data => {
      window.location.reload();
    });
  }
  
  function link(path: string) {
    setOpen(false);
    navigate(path);
  }

  function Backdrop({ onClick }: { onClick: () => void }) {
    return (open ?
      <div className="backdrop" onClick={onClick}></div> : <></>
    );
  }

  return(
    <>
    <Backdrop onClick={() => setOpen(false)}/>
    {/* 共通メニューコンポネント */}
    {!userName && currentPath !== 'login' &&
      <button className='login-btn' onClick={() => link('login')}>
        <RiArrowDropRightLine className='icon' size='16'/>
        <span className='text'>Login</span>
      </button>
    }
    <div className={open ? 'menu-btn open' : 'menu-btn'} onClick={() => setOpen(!open)}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <nav className='menu-nav' role='navigation'>
      <div className={open ? 'menu open' : 'menu'}>
        {userName && 
          <div className='userinfo'>
            <button className='logout-btn' onClick={() => logout()}>
              <RiArrowDropRightLine className='icon' size='16'/>
              <span className='text'>Logout</span>
            </button>
            <img className='profile' src={imgSrc('/tmp/dummy.jpg')} onError={handleImgError} onClick={() => link('mypage')}/>
            <div className='info'>
              <div className='name' onClick={() => link('mypage')}>
                { userName }
              </div>
              <div className='mail'>
                { mail }
              </div>
            </div>
          </div>
        }
        {isSp ?
        menuItem.map((menus) => (
          <div className='category-sp'>
            <div className='title'>
              {menus.category}
            </div>
            <ul>
              {menus.items.map((menu) => (
                <li className={currentPath === menu.url ? 'active' : ''} onClick={() => link(menu.url)} key={menu.id}>
                  {menu.icon}{menu.title}
                </li>
              ))}
            </ul>
          </div>
        ))
        :
        <>
        <div className='left-conents'>
          {menuItem.map((menus) => (
          <div className='category'>
            <div className={activeCategory === menus.category ? 'title active' : 'title'} onMouseEnter={() => setActiveCategory(menus.category)}>
              {menus.category}
            </div>
          </div>
          ))}
        </div>
        <div className='right-conents'>
          {menuItem.map((menus) => (
            activeCategory === menus.category && (
              <ul>
                {menus.items.map((menu) => (
                  <li className={currentPath === menu.url ? 'active' : ''} onClick={() => link(menu.url)} key={menu.id}>
                    {menu.icon}{menu.title}
                  </li>
                ))}
              </ul>
            )
          ))}
        </div>
        </>
        }
      </div>
    </nav>
    </>
  )
}