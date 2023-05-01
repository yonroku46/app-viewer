import React, { useEffect, useReducer, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showPopup, showTopPopup, showCenterPopup } from "../redux/actions/popupActions";

export default function MyPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function openTopPopup(contents: string) {
    dispatch(showTopPopup(contents));
  }

  function openCenterPopup(title: string, contents: string) {
    dispatch(showCenterPopup(title, contents));
  }

  return(
    <>
    mypage
    <button onClick={() => navigate(-1)}>back</button>
    <br/>
    <button onClick={() => openTopPopup('top popup')}>topPop</button>
    <button onClick={() => openCenterPopup('title', 'center popup')}>topCenter</button>
    </>
  )
}