import { useState, ReactElement } from 'react';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import logo from "assets/icon/logo.svg";
import AuthService from 'api/service/AuthService';
import { imgSrc, handleImgError } from "common/utils/imgUtils";
import Backdrop from 'components/backdrop/Backdrop'
import './MenuNav.scss';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Badge from '@mui/material/Badge';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Settings from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';


export interface MenuItem {
  category: string;
  categoryImg: string;
  items: {
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openEl = Boolean(anchorEl);
  const accountMenuProps = {
    elevation: 0,
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.15))',
      mt: 1.5,
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  }
  function handleClick(event: React.MouseEvent<HTMLElement>) {
    if (openEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  function handleClose() {
    setAnchorEl(null);
  };
  
  return(
    <>
    <Backdrop open={open} onClick={() => setOpen(false)}/>
    {/* 共通メニューコンポネント */}
    {userName ?
      <div className='userinfo' onClick={handleClick} onMouseEnter={handleClick} onMouseLeave={handleClose}>
        <Menu anchorEl={anchorEl} open={openEl} PaperProps={accountMenuProps}
         transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          <div onMouseLeave={handleClose}>
          <MenuItem className='account-menu' onClick={() => link('/mypage')}>
            <ListItemIcon>
              <PersonOutlineIcon/>
            </ListItemIcon>
            マイページ
            <Badge className='badge' color="primary" badgeContent={100} max={99}/>
          </MenuItem>
          <Divider/>
          <MenuItem className='account-menu' onClick={() => link('/mypage')}>
            <ListItemIcon>
              <Settings fontSize="small"/>
            </ListItemIcon>
            設定
          </MenuItem>
          <MenuItem className='account-menu' onClick={() => logout()}>
            <ListItemIcon>
              <LogoutIcon fontSize="small"/>
            </ListItemIcon>
            ログアウト
          </MenuItem>
          </div>
        </Menu>
        <Badge variant="dot" color="primary">
          <img className='profile' src={imgSrc('/tmp/dummy.jpg')} onError={handleImgError} onClick={() => {}} alt='profile'/>
        </Badge>
      </div>
    : (currentPath !== 'login' && currentPath !== 'signup') &&
      <button className={isSp ? 'login-btn sp' : 'login-btn'} onClick={() => link('/login')}>
        {isSp ?
        <LoginIcon className='icon sp' sx={{ fontSize: 15 }}/>
      :
      <>
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
            <img className='profile' src={imgSrc('/tmp/dummy.jpg')} onError={handleImgError} onClick={() => link('/mypage')} alt='profile'/>
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
            <img className='logo' src={logo} onClick={() => link('/')} alt='logo'/>
          </div>
        }
        {isSp ?
        menuItem.map((menus) => (
          <div className='menu-sp' key={menus.category}>
            <div className='title'>
              {menus.category}
            </div>
            <ul>
              {menus.items.map((menu) => (
                <li className={currentPath === menu.url ? 'active' : ''} onClick={() => link(menu.url)} key={menu.title}>
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
            <div className='category' key={menus.category}>
              <div className={activeCategory === menus.category ? 'title active' : 'title'} onClick={() => setActiveCategory(menus.category)}>
                <span>{menus.category}</span>
                {activeCategory === menus.category && <KeyboardArrowRightIcon className='icon'/>}
              </div>
            </div>
          ))}
        </div>
        <div className='menu-right'>
          {menuItem.map((menus) => (
            activeCategory === menus.category && (
              <ul key={menus.category}>
                {menus.items.map((menu) => (
                  <li className={currentPath === menu.url ? 'active' : ''} onClick={() => link(menu.url)} key={menu.title}>
                    {menu.icon}{menu.title}
                  </li>
                ))}
              </ul>
            )
          ))}
        </div>
        <div className='category-img'>
          <img src={menuItem.filter((menu) => menu.category === activeCategory)[0].categoryImg} alt='category img'/>
        </div>
        </>
      }
      </div>
    </nav>
    </>
  )
}