import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthService from '../../shared/service/AuthService';
import UserService, { UserInfo } from '../../shared/service/UserService';
import { GrInstagram, GrFacebook, GrTwitter, GrYoutube } from "react-icons/gr";
import './MyPage.scss';

export default function MyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userService = new UserService();
  const authService = new AuthService();

  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      getUserInfo();
    } else {
      navigate('/login');
    }
  }, []);

  async function getUserInfo() {
    setLoading(true);
    await userService.userInfo().then(data => {
      if (data.responseData) {
        setLoading(false);
        setUserInfo(data.responseData);
      }
    });
  }
  
  return(
    <>
    <section className='mypage contents'>
      <h3>basic profile</h3>
      <div>{userInfo?.userName}</div>
      <div>{userInfo?.mail}</div>
    </section>
    <section className='mypage contents'>
      <h3>sns data</h3>
      <GrInstagram/>
      <GrFacebook/>
      <GrYoutube/>
      <GrTwitter/>
    </section>
    <section className='mypage contents'>
      <h3>casting data</h3>
    </section>
    </>
  )
}