import React, { useEffect, useReducer, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";

export default function MyPage() {

  const navigate = useNavigate();

  return(
    <>
    mypage
    <button onClick={() => navigate(-1)}>back</button>
    </>
  )
}