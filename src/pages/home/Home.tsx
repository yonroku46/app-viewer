import React, { useEffect, useReducer, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";

export default function Main() {

  const navigate = useNavigate();

  return(
    <div className='home'>
      <div className='contents'>
        <p className='title'>Title1</p>
        <button onClick={() => navigate('mypage')}>mypage</button>
        <button onClick={() => navigate('login')}>login</button>
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