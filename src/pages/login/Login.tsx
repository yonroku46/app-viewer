import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { createState } from "common/utils/stringUtils";
import lineLogo from 'assets/icon/line_logo.svg';
import googleLogo from 'assets/icon/google_logo.svg';
import Backdrop from 'components/backdrop/Backdrop';
import AuthService from 'api/service/AuthService';
import Oauth2Service from 'api/service/Oauth2Service';
import './Login.scss';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const authService = new AuthService();
  const oAuth2Service = new Oauth2Service();
  
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
    errReset();
    setLoading(true);
    await authService.login(mail, password).then(data => {
      setLoading(false);
      if (data.responseData) {
        if (location.state?.pathname) {
          navigate(location.state?.pathname, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setErrMsg('ログイン情報をもう一度ご確認ください');
      }
    });
  }

  async function socialLogin(type: string) {
    errReset();
    setLoading(true);
    // LINEロジック
    if (type === 'line') {
      const authUrl = "https://access.line.me/oauth2/v2.1/authorize";
      const clientId = "2000050381";
      const redirectUri = `${process.env.REACT_APP_ADDRESS}:${process.env.REACT_APP_VIEW_PORT}/login/oauth2/line`;
      const state = createState(8);
      const url = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&scope=openid%20profile%20email`;
      openLoginPopup(type, state, url);
    }
    // Googleロジック
    else if (type === 'google') {
      alert('まだGoogleは対応しておりません');
    }
    setLoading(false);
  }
    
  async function openLoginPopup(type: string, originState: string, url: string) {
    const name = `${type} Login`;
    const width = 500;
    const height = 760;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const specs = `width=${width},height=${height},left=${left},top=${top}`;
  
    window.open(url, name, specs);
    window.addEventListener('message', (event) => {
      const { code, state } = event.data;
      if (originState === state) {
        oAuth2Service.lineAccess(code).then(data => {
          if (data.responseData) {
            if (location.state?.pathname) {
              navigate(location.state?.pathname, { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          } else {
            setErrMsg('ログイン情報をもう一度ご確認ください');
          }
        });
      }
    });
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