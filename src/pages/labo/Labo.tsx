import React, { useEffect, useState, useMemo } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useScroll, useWindowScroll } from 'react-use';
import { useDispatch, useSelector } from "react-redux";
import { imgSrc, handleImgError } from "../../shared/utils/Utils";
import { format } from 'date-fns';
import { showPopup, showTopPopup, showCenterPopup } from "../../redux/actions/popupActions";
import Authenticator from "../../shared/components/Authenticator";
import './Labo.scss';

export default function Labo() {

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

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
    <section className='labo-page contents' style={myPageStyle}>
      <img src={useMemo(() => imgSrc('/tmp/dummy.jpg'), [])} onError={handleImgError} width='100px'/>
      <img src={useMemo(() => imgSrc('/tmp/dummy.png'), [])} onError={handleImgError} width='100px'/>
      <div>{format(currentTime, 'yyyy-MM-dd')}</div>
      <div>{format(currentTime, 'HH:mm:ss')}</div>
      <button onClick={() => navigate(-1)}>back</button>
      <br/>
      <button className='top' onClick={() => openTopPopup('top popup')}>topPop</button>
      <button className='center' onClick={() => openCenterPopup('title', 'center popup')}>topCenter</button>
      <Authenticator/>
      { isExtendedWait ? 'extended...' : ''}
    </section>
    </>
  )
}