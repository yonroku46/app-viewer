import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './Login.scss';

export default function Login() {

  const navigate = useNavigate();

  useEffect(() => {
  }, []);

  return(
    <>
    <div className='login fullsize'>
      login
      <button onClick={() => navigate(-1)}>back</button>
    </div>
    </>
  )
}