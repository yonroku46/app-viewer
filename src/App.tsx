import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/reducers";
import { showPopup, hidePopup } from "./redux/actions/popupActions";
import { UserState } from "./redux/actions/types/UserActionTypes";
import { HttpApiInterceptor } from './api/interceptors/HttpApiInterceptor';
import AuthService from './shared/service/AuthService';
import logo from "./assets/icon/logo.svg";
import Popup from './shared/components/Popup';
import MenuNav, { MenuItem } from './shared/components/MenuNav';
import Home from './pages/home/Home';
import Search from './pages/search/Search';
import Empty from './pages/empty/Empty';
import MyPage from './pages/mypage/MyPage';
import Login from './pages/login/Login';
import { IoRocketSharp } from "react-icons/io5";
import './App.scss';

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const popup = useSelector((state: RootState) => state.popup);
  const interceptor = HttpApiInterceptor();
  
  const authService = new AuthService();
  const [currentPath, setCurrentPath] = useState<string>();
  const [user, setUser] = useState<UserState>();
  
  const menuItem: MenuItem[] = [
    {
      category: 'Category1',
      items: [
        { id: 0, url: 'search', icon: <IoRocketSharp className='labo' size='15'/>, title: 'Search'},
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
  }, [window.location.pathname]);

  return (
    <>
      <header>
        <div className='header-main'>
          <div className='logo' onClick={() => navigate('')}>
            <img src={logo} alt=''/>
            <IoRocketSharp className='labo' size='15'/>
          </div>
          <div className='side'>
            <MenuNav menuItem={menuItem} currentPath={currentPath} userName={user?.userName} mail={user?.mail} />
          </div>
        </div>
      </header>
      <main>
        <Popup title={popup.title} contents={popup.contents} center={popup.isCenter}/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/mypage" element={<MyPage/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path='/*' element={<Empty/>}/>
        </Routes>
      </main>
      <footer>
        <div>Copyright © 2023 Dad Inc. All Rights Reserved.</div>
      </footer>
    </>
  );
}