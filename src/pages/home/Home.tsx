import React, { useEffect, useState, useMemo } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import mainBanner from "assets/img/main-banner.webp";
import './Home.scss';

export default function Home() {
  const navigate = useNavigate();
  function HomeMain() {
    return(
      <>
      <div className='left'>
        <h1>
          アプリパッケージ<br/>
          デモ<span>作成</span>中<br/>
        </h1>
        <h5>
          アプリの説明
        </h5>
        <button className='sign-btn' onClick={() => navigate('/login')}>無料で始める</button>
      </div>
      <div className='right'>
        <img className='banner-img' src={mainBanner} alt='main'/>
      </div>
      </>
    )
  }

  return(
    <section className='home'>
      <div className='contents main'>
        <HomeMain/>
      </div>
      <div className='contents'>
        <p className='title'>Title2</p>
      </div>
      <div className='contents'>
        <p className='title'>Title3</p>
      </div>
    </section>
  )
}