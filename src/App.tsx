import { useEffect, useState, ReactElement } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/reducers";
import { showPopup, hidePopup } from "./redux/actions/popupActions";
import { UserState } from "./redux/actions/types/UserActionTypes";
import { HttpApiInterceptor } from './api/interceptors/HttpApiInterceptor';
import { useMediaQuery } from 'react-responsive';
import AuthService from './shared/service/AuthService';
import logo from "./assets/icon/logo.svg";
import Popup from './shared/components/Popup';
import Home from './pages/home/Home';
import Empty from './pages/empty/Empty';
import MyPage from './pages/mypage/MyPage';
import Login from './pages/login/Login';
import { IoRocketSharp } from "react-icons/io5";
import { TbSquareRoundedArrowRightFilled } from "react-icons/tb";
import './App.scss';

interface MenuItem {
  category: string;
  items: {
    id: number,
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
  const interceptor = HttpApiInterceptor();

  const authService = new AuthService();
  const [navShow, setNavShow] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>();
  const [user, setUser] = useState<UserState>();

  const permissionPath = ['', 'mypage']
  const menuBar: MenuItem[] = [
    {
      category: 'Category1',
      items: [
        { id: 1, url: 'menu1', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Menu1'},
        { id: 2, url: 'menu2', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Menu2'},
      ]
    },
    {
      category: 'Category2',
      items: [
        { id: 3, url: 'menu3', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Menu3'},
        { id: 4, url: 'menu4', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Menu4'},
      ]
    },
  ]

  useEffect(() => {
    return () => {
      interceptor.releaseInterceptors();
    };
  });

  // useEffect(() => {
  //   // return () => {
  //   //   interceptor.releaseInterceptors();
  //   // };
  // }), [];
  
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
    setUser(authService.getCurrentUser());
    const currentPath = window.location.pathname;
    const path = currentPath.split('/')[1];
    setCurrentPath(path);

    setNavShow(() => {
      for (const permission of permissionPath) {
        if (permission === path) {
          return true;
        }
      }
      for (const category of menuBar) {
        for (const menu of category.items) {
          if (menu.url === path) {
            return true;
          }
        }
      }
      return false;
    })
  }, [window.location.pathname]);

  async function logout() {
    await authService.logout(true).then(data => {
      window.location.reload();
    });
  }

  return (
    <>
      <header>
        <div className='header-main'>
          <Link to="/" className='logo'>
            <img src={logo} alt=''/>
            <IoRocketSharp className='labo' size='15'/>
          </Link>
          <div className='side'>
            {user ? 
              <>
              <button className='logout' onClick={() => logout()}>
                <span><TbSquareRoundedArrowRightFilled className='icon' size='26'/></span>
              </button>
              <div className='username' onClick={() => navigate('mypage')}>
                { user.userName }
              </div>
              </>
              :
              currentPath !== 'login' &&
              <button className='login' onClick={() => navigate('login')}>
                <span className='text'>Login</span>
              </button>
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
                  <li className={currentPath === menu.url ? 'active' : ''} onClick={() => navigate(menu.url)} key={menu.id}>
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