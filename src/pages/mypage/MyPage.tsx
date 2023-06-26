import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from 'components/backdrop/Backdrop';
import AuthService from 'api/service/AuthService';
import UserService, { UserInfo } from 'api/service/UserService';
import YouTubeIcon from '@mui/icons-material/YouTube';
import './Mypage.scss';

export default function Mypage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userService = new UserService();
  const authService = new AuthService();

  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo|undefined>(undefined);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      getUserInfo();
    } else {
      navigate('/login');
    }
  }, []);

  async function getUserInfo() {
    await userService.userInfo().then(data => {
      setUserInfo(data?.responseData);
    });
  }
  
  return(
    <>
    <Backdrop open={loading} loading={loading}/>
    <section className='mypage contents'>
      <h3>basic profile</h3>
      <div>{userInfo?.userName}</div>
      <div>{userInfo?.mail}</div>
    </section>
    <section className='mypage contents'>
      <h3>sns data</h3>
      <YouTubeIcon/>
    </section>
    <section className='mypage contents'>
      <h3>casting data</h3>
    </section>
    </>
  )
}