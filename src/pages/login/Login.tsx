import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import AuthService from '../../shared/service/AuthService';
import './Login.scss';

export default function Login() {

  const authService = new AuthService();
  const navigate = useNavigate();

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
  }, []);

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
      if (data.responseData) {
        setLoading(false);
        errReset();
        navigate(-1);
      } else {
        setErrMsg('ログイン情報をもう一度ご確認ください');
        setLoading(false);
      }
    });
  }

  function errReset() {
    setErrMsg('');
  }

  return(
    <>
    <div className='login fullsize'>
      <form className='login-form' onSubmit={onSubmitHandler}>
        <div className='title'>
          Login
        </div>
        <div className='email'>
          <label>Email</label>
          <input type='email' className={mail.length > 0 ? 'entered' : ''} placeholder='Enter your email' value={mail} onChange={(e) => {setMail(e.target.value); errReset();}}/>
        </div>
        <div className='password'>
          <label>Password</label>
          <input type={passwordType.type} className={password.length > 0 ? 'entered' : ''} placeholder='Enter your password' value={password} onChange={(e) => {setPassword(e.target.value); errReset();}}/>
          <span className='visible' onClick={passwordTypeHandler}>
            { passwordType.visible ? <MdOutlineVisibility/> : <MdOutlineVisibilityOff/> }
          </span>
        </div>
        <div className='recover'>
          Recovery password
        </div>
        {errMsg && <p className='errmsg'>{errMsg}</p>}
        <button type='submit' className='signin'>Sign in</button>
        <hr/>
        <button type='button' className='google-login'>
          <FcGoogle size={22}/>
          <div>Sign in with Google</div>
        </button>
      </form>
    </div>
    </>
  )
}