import React, { useEffect, useState, useMemo } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { imgSrc, handleImgError } from "../../shared/utils/Utils";
import AuthService from '../../shared/service/AuthService';
import { format } from 'date-fns';

export default function Main() {

  const navigate = useNavigate();
  const authService = new AuthService();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return(
    <div className='home'>
      <div className='contents'>
        <p className='title'>Title1</p>
        <img src={useMemo(() => imgSrc('/tmp/dummy.jpg'), [])} width='100px'/>
        <img src={useMemo(() => imgSrc('/tmp/dummy.png'), [])} onError={handleImgError} width='100px'/>
        <div>{format(currentTime, 'yyyy-MM-dd')}</div>
        <div>{format(currentTime, 'HH:mm:ss')}</div>
      </div>
      <div className='contents'>
        <p className='title'>Title2</p>
      </div>
      <div className='contents'>
      <p className='title'>Title3</p>
      </div>
    </div>
  )
}