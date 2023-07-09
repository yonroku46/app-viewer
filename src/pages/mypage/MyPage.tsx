import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Backdrop from 'components/backdrop/Backdrop';
import AuthService from 'api/service/AuthService';
import UserService, { UserInfo } from 'api/service/UserService';
import './MyPage.scss';

export default function MyPage() {
  const navigate = useNavigate();

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
      <button>会員退会</button>
    </section>
    <section className='mypage contents'>
      <h3>sns data</h3>
    </section>
    <section className='mypage contents'>
      <h3>casting data</h3>
    </section>
    </>
  )
}