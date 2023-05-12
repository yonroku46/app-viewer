import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import LoginService from './LoginService';
import './Login.scss';

export default function Login() {

  const navigate = useNavigate();

  const [passwordType, setPasswordType] = useState<{type: string, visible: boolean}>({
    type: 'password',
    visible: false
  });
  const [email, setEmail] = useState<string>("a@a.a");
  const [password, setPassword] = useState<string>("a");

  function passwordTypeHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    setPasswordType(() => {
      if (!passwordType.visible) {
        return { type: 'text', visible: true };
      }
      return { type: 'password', visible: false };
    })
  }

  useEffect(() => {
  }, []);

  async function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    // prevent page refresh
    e.preventDefault();
    
    if (email === "" || password === "") {
      alert("Email or Password is Empty.");
      return;
    }

    const data = await LoginService.login(email, password);
    if (data) {
      console.log(data)
      navigate(-1);
    }
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
          <input type='email' className={email.length > 0 ? 'entered' : ''} placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className='password'>
          <label>Password</label>
          <input type={passwordType.type} className={password.length > 0 ? 'entered' : ''} placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          <span className='visible' onClick={passwordTypeHandler}>
            { passwordType.visible ? <MdOutlineVisibility/> : <MdOutlineVisibilityOff/> }
          </span>
        </div>
        <div className='recover'>
          Recovery password
        </div>
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