import React, { useEffect, useReducer, useRef } from 'react';
import { Link, Route, Routes, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/reducers";
import { showPopup, hidePopup } from "./redux/actions/popupActions";
import logo from "./assets/icon/app-icon.png";
import Popup from './components/share/Popup';
import Main from './components/Main';
import Empty from './components/Empty';
import MyPage from './components/MyPage';
import axios from 'axios';
import './App.scss';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

function App() {

  const popup = useSelector((state: RootState) => state.popup);
  const dispatch = useDispatch();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (popup.isVisible) {
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
  }, [popup.isVisible]);

  return (
    <>
      <header>
        <div className='contents'>
        <img src={logo} alt="logo" className='invert'/>
        </div>
      </header>
      <section>
        <Popup title={popup.title} contents={popup.contents} center={popup.isCenter}/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/mypage" element={<MyPage/>}/>
            <Route path='/*' element={<Empty/>}/>
          </Routes>
        </BrowserRouter>
      </section>
    </>
  );
}
 
export default App;
