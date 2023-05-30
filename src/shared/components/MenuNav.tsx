import { useState, ReactElement } from 'react';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import logo from "../../assets/icon/logo.svg";
import AuthService from '../../shared/service/AuthService';
import { imgSrc, handleImgError } from "../../shared/utils/Utils";
import { RiArrowDropRightLine } from "react-icons/ri";
import { RiUserReceivedFill, RiUserSharedFill } from "react-icons/ri";
import './MenuNav.scss';

export interface MenuItem {
  category: string;
  categoryImg: string;
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
    {userName ?
      <button className={isSp ? 'logout-btn sp' : 'logout-btn'} onClick={() => logout()}>
        {isSp ?
          <RiUserSharedFill className='icon sp' size='16'/>
        :
        <>
          <RiArrowDropRightLine className='icon' size='16'/>
          <span className='text'>ログアウト</span>
        </>
        }
      </button>
    : currentPath !== 'login' &&
      <button className={isSp ? 'login-btn sp' : 'login-btn'} onClick={() => link('/login')}>
        {isSp ?
        <RiUserReceivedFill className='icon sp' size='16'/>
      :
      <>
        <RiArrowDropRightLine className='icon' size='16'/>
        <span className='text'>ログイン / 会員登録</span>
      </>
      }
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
        {userName ?
          <div className='userinfo'>
            <img className='profile' src={imgSrc('/tmp/dummy.jpg')} onError={handleImgError} onClick={() => link('/mypage')}/>
            <div className='info'>
              <div className='name' onClick={() => link('/mypage')}>
                { userName }
              </div>
              <div className='mail'>
                { mail }
              </div>
            </div>
          </div>
          :
          <div className='userinfo'>
            <img className='logo' src={logo} onClick={() => link('/')}/>
          </div>
        }
        {isSp ?
        menuItem.map((menus) => (
          <div className='menu-sp'>
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
        <div className='menu-left'>
          {menuItem.map((menus) => (
          <div className='category'>
            <div className={activeCategory === menus.category ? 'title active' : 'title'} onClick={() => setActiveCategory(menus.category)}>
              {menus.category}
            </div>
          </div>
          ))}
        </div>
        <div className='menu-right'>
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
        <div className='category-img'>
          <img src={menuItem.filter((menu) => menu.category === activeCategory)[0].categoryImg} />
        </div>
        </>
        }
      </div>
    </nav>
    </>
  )
}