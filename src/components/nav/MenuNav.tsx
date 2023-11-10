import { useState, ReactElement } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import AuthService from 'api/service/AuthService';
import { SearchArea } from 'components/input/SearchInput';
import { imgSrc, handleImgError } from "common/utils/ImgUtils";
import Backdrop from 'components/backdrop/Backdrop'
import Modal from 'components/modal/Modal';
import './MenuNav.scss';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
  items: {
    path: string,
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
    {(currentPath !== 'search') && <SearchArea/>}
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
    :
      <button className='login-btn' onClick={() => link('/login')}>
        <AccountCircleIcon className='icon'/>
      </button>
    }
    </>
  )
}