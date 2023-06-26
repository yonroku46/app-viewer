import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import { showPopup, hidePopup } from "redux/actions/popupActions";
import { UserState } from "redux/types/UserActionTypes";
import AuthService from 'api/service/AuthService';
import logo from "assets/icon/logo.svg";
import category1 from "assets/img/category1.avif";
import category2 from "assets/img/category2.avif";
import Popup from 'components/popup/Popup';
import MenuNav, { MenuItem } from 'components/nav/MenuNav';
import Home from 'pages/home/Home';
import Search from 'pages/search/Search';
import Empty from 'pages/empty/Empty';
import Mypage from 'pages/mypage/Mypage';
import Login from 'pages/login/Login';
import Signup from 'pages/signup/Signup';
import Labo from 'pages/labo/Labo';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PsychologyTwoToneIcon from '@mui/icons-material/PsychologyTwoTone';
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';
import WidgetsTwoToneIcon from '@mui/icons-material/WidgetsTwoTone';
import SummarizeTwoToneIcon from '@mui/icons-material/SummarizeTwoTone';
import './App.scss';

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  const authService = new AuthService();

  const [currentPath, setCurrentPath] = useState<string>('');
  const [user, setUser] = useState<UserState|undefined>(undefined);
  const popup = useSelector((state: RootState) => state.popup);
  
  const menuItem: MenuItem[] = [
    {
      category: 'カテゴリー',
      categoryImg: category1,
      items: [
        { url: 'search', icon: <FindInPageTwoToneIcon/>, title: '検索'},
        { url: 'menu1', icon: <WidgetsTwoToneIcon/>, title: 'メニュー1'},
        { url: 'menu2', icon: <SummarizeTwoToneIcon/>, title: 'メニュー2'},
      ]
    },{
      category: 'ラボ',
      categoryImg: category2,
      items: [
        { url: 'labo', icon: <PsychologyTwoToneIcon/>, title: '実験室'},
      ]
    },
  ]

  // ポップアップ表示ロジック、上段ポップアップの場合2秒位表示
  useEffect(() => {
    if (popup.isShow) {
      if (popup.isCenter) {
        dispatch(showPopup());
      } else {
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
    const currentPath = location.pathname;
    const path = currentPath.split('/')[1];
    setCurrentPath(path);
  }, [location.pathname]);

  function Header() {
    return(
      <header>
        <div className='header-main'>
          <div className='logo' onClick={() => navigate('/')}>
            <img src={logo} alt=''/>
            <RocketLaunchIcon className='labo'/>
          </div>
          <div className='side'>
            <MenuNav menuItem={menuItem} currentPath={currentPath} userName={user?.userName} mail={user?.mail} />
          </div>
        </div>
      </header>
    )
  }

  function Footer() {
    return(
      <footer>
        <div>Copyright © 2023 Dad Inc. All Rights Reserved.</div>
      </footer>
    )
  }

  return(
    <>
      <Header/>
      <main>
        <Popup title={popup.title} contents={popup.contents} link={popup.link} center={popup.isCenter}/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/mypage" element={<Mypage/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/labo" element={<Labo/>}/>
          <Route path='/*' element={<Empty/>}/>
        </Routes>
      </main>
      <Footer/>
    </>
  );
}