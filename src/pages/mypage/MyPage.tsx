import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './MyPage.scss';

export default function MyPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
  }, []);
  
  return(
    <>
    <section className='mypage contents'>
      mypage
      <button onClick={() => navigate(-1)}>back</button>
    </section>
    </>
  )
}