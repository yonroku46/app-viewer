import { useEffect, useState, ReactElement } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/reducers";
import { showPopup, hidePopup } from "./redux/actions/popupActions";
import { UserState } from "./redux/actions/types/UserActionTypes";
import { HttpApiInterceptor } from './api/interceptors/HttpApiInterceptor';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import AuthService from './shared/service/AuthService';
import logo from "./assets/icon/logo.svg";
import Popup from './shared/components/Popup';
import Home from './pages/home/Home';
import Empty from './pages/empty/Empty';
import MyPage from './pages/mypage/MyPage';
import Login from './pages/login/Login';
import { IoLogIn, IoLogOut, IoRocketSharp, IoChevronDownOutline } from "react-icons/io5";
import './App.scss';

interface MenuItem {
  category: string;
  items: {
    url: string,
    icon: ReactElement<any, any>,
    title: string
  }[];
}

export default function App() {
  const version = 'ver.1.0';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const popup = useSelector((state: RootState) => state.popup);
  const isSp = useMediaQuery({ maxWidth: 767 });
  const interceptor = new HttpApiInterceptor();

  const authService = new AuthService();
  const [navShow, setNavShow] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>();
  const [user, setUser] = useState<UserState>();

  const menuBar: MenuItem[] = [
    {
      category: 'Category1',
      items: [
        { url: 'mypage', icon: <IoRocketSharp className='labo' size='15'/>, title: 'MyPage'},
        { url: 'menu1', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Menu1'},
      ]
    },
    {
      category: 'Category2',
      items: [
        { url: 'menu2', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Menu2'},
        { url: 'menu3', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Menu3'},
      ]
    },
  ]

  useEffect(() => {
    // axoisセットアップ
    axios.defaults.baseURL = process.env.REACT_APP_API_BASE;
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    return () => {
      interceptor.releaseInterceptors();
    };
  },[])

  useEffect(() => {
    // ポップアップ表示ロジック
    if (popup.isShow) {
      if (popup.isCenter) {
        dispatch(showPopup());
      } else {
        // 上段ポップアップの場合2秒位表示
        dispatch(showPopup());
        const timer = setTimeout(() => {
          dispatch(hidePopup());
        }, 2200);
        return () => clearTimeout(timer);
      }
    }
  }, [popup.isShow, popup.isCenter]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const path = currentPath.split('/')[1];
    setCurrentPath(path);
    setNavShow(getPageStatus(path));
  }, [window.location.pathname]);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, [user]);

  function getPageStatus(url: string): boolean {
    const permissionList = ['']
    for (const permission of permissionList) {
      if (permission === url) {
        return true;
      }
    }
    for (const category of menuBar) {
      for (const menu of category.items) {
        if (menu.url === url) {
          return true;
        }
      }
    }
    return false;
  }

  return (
    <>
      <header>
        <div className='header-main'>
          <Link to="/" className='logo'>
            <img src={logo} className=''/>
            <IoRocketSharp className='labo' size='15'/>
          </Link>
          <div className='side'>
            {user ? 
              <div className='logout' onClick={() => authService.logout(true)}>
                <span><IoLogOut size='30'/></span>
                <span className='text'>{ user.userName }</span>
              </div>
              :
              <div className='login' onClick={() => navigate('login')}>
                <span><IoLogIn size='30'/></span>
                <span className='text'>Login</span>
              </div>
            }
          </div>
        </div>
      </header>
      <main>
        <Popup title={popup.title} contents={popup.contents} center={popup.isCenter}/>
        {navShow &&
        <nav>
          {menuBar.map((menus) => (
            <div className='category'>
              <div className='title'>
                {!isSp && menus.category}
              </div>
              <ul>
                {menus.items.map((menu) => (
                  <li className={currentPath == menu.url ? 'active' : ''} onClick={() => navigate(menu.url)}>
                    {menu.icon}{!isSp && menu.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        }
        <section className={navShow ? 'nav-on' : ''}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/mypage" element={<MyPage/>}/>
            <Route path='/*' element={<Empty/>}/>
          </Routes>
        </section>
      </main>
      <footer>
        <div>{version}</div>
      </footer>
    </>
  );
}