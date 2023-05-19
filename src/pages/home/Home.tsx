import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { format } from 'date-fns';

export default function Main() {

  const navigate = useNavigate();
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