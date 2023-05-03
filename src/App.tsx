import React, { useEffect, useReducer, useRef } from 'react';
import { Link, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/reducers";
import { showPopup, hidePopup } from "./redux/actions/popupActions";
import logo from "./assets/icon/app-icon.png";
import Popup from './components/share/Popup';
import Home from './components/app/Home';
import Empty from './components/app/Empty';
import MyPage from './components/app/mypage/MyPage';
import Login from './components/app/login/Login';
import axios from 'axios';
import './App.scss';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

function App() {

  const popup = useSelector((state: RootState) => state.popup);
  const dispatch = useDispatch();

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

  return (
    <>
      <header>
        <div className='header-main'>
          <Link to="/" className='logo'><img src={logo} className='invert'/></Link>
        </div>
      </header>
      <section>
        <Popup title={popup.title} contents={popup.contents} center={popup.isCenter}/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/mypage" element={<MyPage/>}/>
          <Route path='/*' element={<Empty/>}/>
        </Routes>
      </section>
    </>
  );
}
 
export default App;
