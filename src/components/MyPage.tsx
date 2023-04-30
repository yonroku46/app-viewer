import React, { useEffect, useReducer, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showPopup, setPopupTitle, setPopupContents, setPopupCenter, setPopupTop  } from "../redux/actions/popupActions";

export default function MyPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function openTopPopup(contents: String) {
    dispatch(setPopupTop());
    dispatch(setPopupContents(contents));
    dispatch(showPopup());
  }

  function openCenterPopup(title: String, contents: String) {
    dispatch(setPopupCenter());
    dispatch(setPopupTitle(title));
    dispatch(setPopupContents(contents));
    dispatch(showPopup());
  }

  return(
    <>
    mypage
    <button onClick={() => navigate(-1)}>back</button>
    <br/>
    <button onClick={() => openTopPopup('con1')}>topPop</button>
    <button onClick={() => openCenterPopup('title1', 'con2')}>topCenter</button>
    </>
  )
}