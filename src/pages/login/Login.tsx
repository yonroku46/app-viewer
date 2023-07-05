import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import lineLogo from 'assets/icon/line_logo.svg';
import googleLogo from 'assets/icon/google_logo.svg';
import logo from "assets/icon/logo.svg";
import Backdrop from 'components/backdrop/Backdrop';
import AuthService from 'api/service/AuthService';
import './Login.scss';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const authService = new AuthService();
  
  const [passwordType, setPasswordType] = useState<{type: string, visible: boolean}>({
    type: 'password',
    visible: false
  });
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  function passwordTypeHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    setPasswordType(() => {
      if (!passwordType.visible) {
        return { type: 'text', visible: true };
      }
      return { type: 'password', visible: false };
    })
  }

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      navigate(-1);
    }
  }, [authService]);

  function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    errReset();
    if (mail === "" || password === "") {
      setErrMsg("メールとパスワードを入力してください");
      return;
    }
    login();
  }

  async function login() {
    setLoading(true);
    await authService.login(mail, password).then(data => {
      setLoading(false);
      if (data.responseData) {
        errReset();
        if (location.state?.pathname) {
          navigate(location.state?.pathname);
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setErrMsg('ログイン情報をもう一度ご確認ください');
      }
    });
  }

  function socialLogin(app: string) {
    if (app === 'line') {
      alert('まだLINEは対応しておりません');
      setErrMsg('');
    } else if (app === 'google') {
      alert('まだGoogleは対応しておりません');
      setErrMsg('');
    }
  }

  function errReset() {
    setErrMsg('');
  }

  return(
    <>
    <Backdrop open={loading} loading={loading}/>
    <section className='login fullsize'>
      <form className='login-form' onSubmit={onSubmitHandler}>
        <div className='sub-title'>
          Login
        </div>
        <div className='title'>
          ログイン
        </div>
        <div className='email'>
          <label>メールアドレス</label>
          <input type='email' id='email' className={mail.length > 0 ? 'entered' : ''} placeholder='メールアドレスを入力' value={mail} onChange={(e) => {setMail(e.target.value); errReset();}}/>
        </div>
        <div className='password'>
          <label>パスワード</label>
          <input type={passwordType.type} id='password' className={password.length > 0 ? 'entered' : ''} placeholder='パスワードを入力' value={password} onChange={(e) => {setPassword(e.target.value); errReset();}}/>
          {password.length > 0 &&
            <span className='visible' onClick={passwordTypeHandler}>
              { passwordType.visible ? <VisibilityIcon sx={{ fontSize: 16 }}/> : <VisibilityOffIcon sx={{ fontSize: 16 }}/> }
            </span>
          }
        </div>
        <div className='recover'>
          <span className='text' onClick={() => navigate('/recover')}>
            パスワード再発行
          </span>
        </div>
        <div className='err-area'>
          {errMsg && <p className='errmsg'>{errMsg}</p>}     
        </div>
        <button type='submit' className='signin'>ログイン</button>
        <hr/>
        <button type='button' className='social-signin line' onClick={() => socialLogin('line')}>
          <img src={lineLogo} width='20px' height='20px'/>
          <div>LINEでログイン</div>
        </button>
        <button type='button' className='social-signin google' onClick={() => socialLogin('google')}>
          <img src={googleLogo} width='20px' height='20px'/>
          <div>Googleでログイン</div>
        </button>
        <p className='signup'>
          アカウントを持っていない場合は<span onClick={() => navigate('/signup')}>新規登録</span>から
        </p>
      </form>
    </section>
    </>
  )
}