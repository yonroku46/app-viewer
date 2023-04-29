import React, { useEffect, useReducer, useState } from 'react';
import { Link, Route, Routes, BrowserRouter } from "react-router-dom";
import logo from "./assets/icon/app-icon.png";
import Main from './components/Main';
import Empty from './components/Empty';
import MyPage from './components/MyPage';
import './App.scss';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

function App() {
  return (
    <>
      <header>
        <div className='contents'>
        <img src={logo} alt="logo"/>
        </div>
      </header>
        <section>
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
