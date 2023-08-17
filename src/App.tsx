import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from 'react-helmet-async';
import { RootState } from "redux/reducers";
import { showPopup, hidePopup } from "redux/actions/popupActions";
import { UserState } from "redux/types/UserActionTypes";
import AuthService from 'api/service/AuthService';
import logo from "assets/icon/logo.svg";
import category1 from "assets/img/category1.avif";
import category2 from "assets/img/category2.avif";
import Popup from 'components/popup/Popup';
import MenuNav, { MenuItem } from 'components/nav/MenuNav';
import { showCenterLinkPopup } from "redux/actions/popupActions";
import Home from 'pages/home/Home';
import Search from 'pages/search/Search';
import Empty from 'components/empty/Empty';
import MyPage from 'pages/mypage/MyPage';
import Products from 'pages/products/Products';
import ProductDetail from 'pages/products/ProductDetail';
import AuthPage from 'pages/auth/AuthPage';
import AuthRecover from 'pages/auth/AuthRecover';
import AdminPage from 'pages/manage/admin/AdminPage';
import ShopPage from 'pages/manage/shop/ShopPage';
import Login from 'pages/login/Login';
import OAuth2Login from 'pages/login/OAuth2Login';
import Recover from 'pages/recover/Recover';
import Signup from 'pages/signup/Signup';
import Contact from 'pages/contact/Contact';
import Policy from 'pages/policy/Policy';
import Labo from 'pages/labo/Labo';
import './App.scss';

import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ContactSupportTwoToneIcon from '@mui/icons-material/ContactSupportTwoTone';
import PsychologyTwoToneIcon from '@mui/icons-material/PsychologyTwoTone';
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  const authService = new AuthService();

  const [currentPath, setCurrentPath] = useState<string>('');
  const [user, setUser] = useState<UserState|undefined>(undefined);
  const popup = useSelector((state: RootState) => state.popup);
  
  type PathMap = {
    [key: string]: {
      title: string;
      description: string;
    };
  };
  
  const pathMap: PathMap = {
    login: { title: 'ログイン', description: 'アカウントでログインしてサービスを利用してください' },
    recover: { title: 'パスワード再発行', description: 'パスワードの再発行' },
    signup: { title: '会員登録', description: '新規登録ページ' },
    mypage: { title: 'マイページ', description: 'マイページへようこそ' },
    search: { title: '検索', description: '検索ページ' },
    products: { title: '商品', description: '商品ページ' },
    labo: { title: '実験室', description: '実験室ページ' },
    contact: { title: 'お問い合わせ', description: 'お問い合わせページ' },
    policy: { title: '運用ポリシー', description: '運用ポリシーページ' },
    auth: { title: '認証', description: '認証ページ' },
    admin: { title: '管理者ページ', description: '管理者ページへようこそ' },
  };

  const menuItem: MenuItem[] = [
    {
      category: 'サンプル',
      categoryImg: category1,
      items: [
        { url: 'products', icon: <FindInPageTwoToneIcon/>, title: '商品' },
        { url: 'contact', icon: <ContactSupportTwoToneIcon/>, title: 'お問い合わせ' },
        { url: 'policy', icon: <AdminPanelSettingsTwoToneIcon/>, title: 'ポリシー' },
      ]
    },{
      category: 'ラボ',
      categoryImg: category2,
      items: [
        { url: 'labo', icon: <PsychologyTwoToneIcon/>, title: '実験室' },
      ]
    }
  ]

  // ユーザーの実際ウィンドウズ高さに沿ってvh変更
  useEffect(() => {
    const updateVh = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    updateVh();
    window.addEventListener('resize', updateVh);
    return () => {
      window.removeEventListener('resize', updateVh);
    };
  }, []);

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
  
  // URL変更による処理
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const currentPath = location.pathname;
    const path = currentPath.split('/')[1];
    setCurrentPath(path);
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      if (currentUser.mailAuth) {
        setUser(currentUser);
      } else {
        dispatch(showCenterLinkPopup('権限なし', '権限取得のため\nメールでの認証が必要です', '/'));
        authService.logout(true).then(data => {
          setUser(undefined);
        });
      }
    }
  }, [location.pathname]);

  function Header() {
    const currentPathData = pathMap[currentPath];
    return(
      <header>
        <Helmet>
          <title>{currentPathData?.title ? currentPathData.title + ' - DadLabo' : 'DadLabo'}</title>
          <meta name="description" content={currentPathData?.description ? currentPathData.description : 'DadLabへようこそ'}/>
          <link rel="canonical" href={`https://dad-labo.com/${currentPath}`}/>
        </Helmet>
        <div className='header-main'>
          <div className='logo' onClick={() => navigate('/')}>
            <img src={logo} alt=''/>
            <RocketLaunchIcon className='labo'/>
          </div>
          <div className='side'>
            <MenuNav menuItem={menuItem} currentPath={currentPath} userName={user?.userName} profileImg={user?.profileImg} mail={user?.mail} role={user?.role}/>
          </div>
        </div>
      </header>
    )
  }

  function Footer() {
    return(
      <footer>
        <div className='footer-main'>
          <div className='side'>
            Copyright © 2023 Dad Inc. All Rights Reserved.
          </div>
        </div>
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
            <Route path="/login/oauth2/:type" element={<OAuth2Login/>}/>
          <Route path="/recover" element={<Recover/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/mypage" element={<MyPage/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/products" element={<Products/>}/>
            <Route path="/products/:id" element={<ProductDetail/>}/>
          <Route path="/labo" element={<Labo/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/policy" element={<Policy/>}/>
          <Route path="/auth" element={<AuthPage/>}/>
            <Route path="/auth/recover" element={<AuthRecover/>}/>
          <Route path="/manage/admin" element={<AdminPage/>}/>
            <Route path="/manage/admin/:tab" element={<AdminPage/>}/>
          <Route path="/manage/shop" element={<ShopPage/>}/>
            <Route path="/manage/shop/:tab" element={<ShopPage/>}/>
          <Route path='/*' element={<Empty/>}/>
        </Routes>
      </main>
      <Footer/>
    </>
  );
}