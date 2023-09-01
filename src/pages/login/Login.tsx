import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { lineLogin, googleLogin } from "common/utils/OAuth2Utils";
import lineLogo from 'assets/icon/line_logo.svg';
import googleLogo from 'assets/icon/google_logo.svg';
import AuthService from 'api/service/AuthService';
import OAuth2Service from 'api/service/OAuth2Service';
import { loading, unloading } from "store/actions/loadingActions";
import './Login.scss';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const authService = new AuthService();
  const oAuth2Service = new OAuth2Service();

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');
  const code = searchParams.get('code');
  
  const [passwordType, setPasswordType] = useState<{type: string, visible: boolean}>({
    type: 'password',
    visible: false
  });
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    done()
    if (location.state?.auth === 'oauth2' && type && code) {
      load();
      if (type === 'line') {
        oAuth2Service.lineAccess(code).then(data => {
          if (data.responseData) {
            loginSuccess();
          } else {
            setErrMsg('ソーシャルログインのアクセスに失敗しました');
            done();
          }
        });
      }
      else if (type === 'google') {
        oAuth2Service.googleAccess(code).then(data => {
          if (data.responseData) {
            loginSuccess();
          } else {
            setErrMsg('ソーシャルログインのアクセスに失敗しました');
            done();
          }
        });
      }
    } else {
      if (authService.getCurrentUser()) {
        navigate(-1);
      }
    }
  }, []);

  function load() {
    dispatch(loading(true, true));
  }
  function done() {
    dispatch(unloading());
  }
  
  async function login() {
    errReset();
    load();
    await authService.login(mail, password).then(data => {
      if (data.responseData) {
        loginSuccess();
      } else {
        setErrMsg('ログイン情報をもう一度ご確認ください');
        done();
      }
    });
  }

  function loginSuccess() {
    const prev = location.state?.prev;
    if (prev) {
      navigate(prev, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
    done();
  }

  async function socialLogin(type: string) {
    errReset();
    load();
    localStorage.setItem('prev', location.state?.prev)
    if (type === 'line') {
      window.location.href = lineLogin();
    } else if (type === 'google') {
      window.location.href = googleLogin();
    }
    done();
  }

  function passwordTypeHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    setPasswordType(() => {
      if (!passwordType.visible) {
        return { type: 'text', visible: true };
      }
      return { type: 'password', visible: false };
    })
  }

  function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    errReset();
    if (mail === "" || password === "") {
      setErrMsg("メールとパスワードを入力してください");
      return;
    }
    login();
  }

  function errReset() {
    setErrMsg('');
  }

  return(
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
          <img src={lineLogo}/>
          <div>LINEでログイン</div>
        </button>
        <button type='button' className='social-signin google' onClick={() => socialLogin('google')}>
          <img src={googleLogo}/>
          <div>Googleでログイン</div>
        </button>
        <p className='signup'>
          アカウントを持っていない場合は<span onClick={() => navigate('/signup')}>新規登録</span>から
        </p>
      </form>
    </section>
  )
}