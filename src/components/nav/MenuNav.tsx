import { useEffect, useState, ReactElement } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import logo from "assets/icon/logo.svg";
import AuthService from 'api/service/AuthService';
import { imgSrc, handleImgError } from "common/utils/ImgUtils";
import Backdrop from 'components/backdrop/Backdrop'
import Modal from 'components/modal/Modal';
import './MenuNav.scss';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import Badge from '@mui/material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Settings from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

export interface MenuItem {
  category: string;
  categoryPath: string;
  categoryImg: string;
  items: {
    url: string,
    icon: ReactElement<any, any>,
    title: string
  }[];
}

export default function MenuNav({ menuItem, currentPath, userName, profileImg, mail, role }: { menuItem: MenuItem[], currentPath: string | undefined, userName: string | undefined, profileImg: string | undefined, mail: string | undefined, role: number | undefined}) {
  const isSp = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  const location = useLocation();

  const authService = AuthService();

  const [open, setOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>(menuItem[0].category);
  const [categoryImg, setCategoryImg] = useState<string>(menuItem[0].categoryImg);

  useEffect(() => {
    const item = menuItem.find((item) => item.items.some((menu) => menu.url === currentPath));
    if (item) {
      setActiveCategory(item.category);
    }
  }, [currentPath, menuItem]);

  useEffect(() => {
    setCategoryImg(menuItem.filter((menu) => menu.category === activeCategory)[0].categoryImg);
  }, [activeCategory]);

  async function logout() {
    await authService.logout(true).then(data => {
      window.location.reload();
    });
  }
  
  function link(path: string) {
    setOpen(false);
    navigate(path, { state: { prev: location.pathname } });
  }

  const settingData: Record<string, string> = {
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

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    if (openEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(e.currentTarget);
    }
  }

  function handleModalClose() {
    setModalOpen(false);
  };
  
  return(
    <>
    <Backdrop open={open} onClick={() => setOpen(false)}/>
    <Modal type='app' data={settingData} open={modalOpen} onClose={handleModalClose}/>
    {/* 共通メニューコンポネント */}
    {(currentPath !== 'login') && userName ?
      <div className='user-badge' onClick={handleClick}>
        <Menu anchorEl={anchorEl} open={openEl} PaperProps={accountMenuProps}
         transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          {role === 1 && <>
          <MenuItem className='account-menu' onClick={() => link('/mypage')}>
            <ListItemIcon>
              <PersonOutlineIcon/>
            </ListItemIcon>
            マイページ
            <Badge className='badge' color="primary" badgeContent={100} max={99}/>
          </MenuItem>
          <MenuItem className='account-menu' onClick={() => link('/cart')}>
            <ListItemIcon>
              <ShoppingCartOutlinedIcon/>
            </ListItemIcon>
            カート
            <Badge className='badge' color="primary" badgeContent={1} max={99}/>
          </MenuItem>
          </>}
          {role === 2 &&
          <MenuItem className='account-menu' onClick={() => link('/shop/manage/main')}>
            <ListItemIcon>
              <StorefrontOutlinedIcon/>
            </ListItemIcon>
            ショップ管理
          </MenuItem>
          }
          {role === 9 &&
          <MenuItem className='account-menu' onClick={() => link('/admin/manage/main')}>
            <ListItemIcon>
              <LockPersonOutlinedIcon/>
            </ListItemIcon>
            アプリ管理
          </MenuItem>
          }
          <Divider/>
          <MenuItem className='account-menu' onClick={() => setModalOpen(true)}>
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
        </Menu>
        <img className='profile' src={imgSrc(profileImg)} onError={handleImgError} onClick={() => {}} alt='profile'/>
      </div>
    : (currentPath !== 'login') &&
      <button className='login-btn' onClick={() => link('/login')}>
        <span className='text'>ログイン</span>
      </button>
    }
    {/* <div className={open ? 'menu-btn open' : 'menu-btn'} onClick={() => {setOpen(!open); setAnchorEl(null);}}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div className='menu-nav'>
      <div className={open ? 'menu scroll open' : 'menu scroll'}>
        {userName ?
          <div className='userinfo'>
            <img className='profile' src={imgSrc(profileImg)} onError={handleImgError} onClick={() => link('/mypage')} alt='profile'/>
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
        {isSp ? menuItem.map((menus) => (
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
        <div className='menu-img'>
          <img className='thumbnail' src={categoryImg} alt='thumbnail'/>
        </div>
        </>
      }
      </div>
    </div> */}
    </>
  )
}