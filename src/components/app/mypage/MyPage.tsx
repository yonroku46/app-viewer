import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useScroll, useWindowScroll } from 'react-use';
import { useDispatch, useSelector } from "react-redux";
import { showPopup, showTopPopup, showCenterPopup } from "../../../redux/actions/popupActions";
import Authenticator from "../../share/Authenticator";
import './MyPage.scss';

export default function MyPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { y: windowY } = useWindowScroll();
  const spareArea: number = 100;
  const [isExtendedWait, setIsExtendedWait] = useState<boolean>(false);

  useEffect(() => {
    // スクロールが一番上に来る時処理
    if (windowY === 0) {
      console.log('scroll start');
    }
    // スクロールが一番下に来る時処理
    if (window.innerHeight + windowY >= (document.documentElement || document.body).offsetHeight - spareArea) {
      setIsExtendedWait(true);
      setTimeout(() => {
        setIsExtendedWait(false);
        console.log('scroll end');
      }, 1000);
    }
  }, [windowY]);

  function openTopPopup(contents: string) {
    dispatch(showTopPopup(contents));
  }

  function openCenterPopup(title: string, contents: string) {
    dispatch(showCenterPopup(title, contents));
  }

  const myPageStyle = {
    height: isExtendedWait ? 'calc(100% + 200px)' : '100%'
  };

  return(
    <>
    <div className='mypage contents' style={myPageStyle}>
      mypage
      <button onClick={() => navigate(-1)}>back</button>
      <br/>
      <button className='top' onClick={() => openTopPopup('top popup')}>topPop</button>
      <button className='center' onClick={() => openCenterPopup('title', 'center popup')}>topCenter</button>
      <Authenticator/>
      { isExtendedWait ? 'extended...' : ''}
    </div>
    </>
  )
}