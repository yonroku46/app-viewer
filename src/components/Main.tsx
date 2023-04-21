import React, { useEffect, useReducer, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";

export default function Main() {

  const navigate = useNavigate();

  return(
    <>
    home
    <button onClick={() => navigate('mypage')}>mypage</button>
    </>
  )
}