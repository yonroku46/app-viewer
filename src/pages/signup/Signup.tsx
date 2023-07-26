import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Backdrop from 'components/backdrop/Backdrop';
import AuthComplete from 'components/auth/AuthComplete';
import AuthService from 'api/service/AuthService';
import './Signup.scss';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import Checkbox from '@mui/material/Checkbox';

export default function Signup() {
  const navigate = useNavigate();

  const authService = new AuthService();

  const [passwordType, setPasswordType] = useState<{type: string, visible: boolean}>({
    type: 'password',
    visible: false
  });
  const [name, setName] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [termsCheck, setTermsCheck] = useState(false);
  const [errMsg, setErrMsg] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      navigate(-1);
    }
  }, [authService]);
  
  function checkHandler(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    setTermsCheck(checked);
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
    if (name === "" || mail === "" || password === "") {
      setErrMsg("入力に空欄があります");
      return;
    } else if (password.length < 8) {
      setErrMsg("パスワードが短過ぎます");
      return;
    } else if (password.length > 50) {
      setErrMsg("パスワードが長過ぎます");
      return;
    }
    submit();
  }
  
  async function submit() {
    setLoading(true);
    await authService.submit(name, mail, password).then(data => {
      setLoading(false);
      if (data.responseData) {
        errReset();
        setIsComplete(true);
      } else {
        setErrMsg('既に登録されているメールアドレスです');
      }
    });
  }

  function errReset() {
    setErrMsg('');
  }

  return(
    <>
    <Backdrop open={loading} loading={loading}/>
    <section className='signup fullsize'>
      {isComplete ? 
        <AuthComplete icon={<ForwardToInboxIcon className='icon' sx={{ fontSize: 80 }}/>} title={'メールを送信しました'} subTitle={'完了させるためには\nメールでの認証が必要です'} path={'login'}/>
        :  
        <form className='signup-form' onSubmit={onSubmitHandler}>
          <div className='sub-title'>
            Signup
          </div>
          <div className='title'>
            会員登録
          </div>
          <div className='name'>
            <label>ユーザー名</label>
            <input type='text' id='name' className={name.length > 0 ? 'entered' : ''} placeholder='ユーザー名を入力' value={name} onChange={(e) => {setName(e.target.value); errReset();}}/>
          </div>
          <div className='email'>
            <label>メールアドレス</label>
            <input type='email' id='email' className={mail.length > 0 ? 'entered' : ''} placeholder='メールアドレスを入力' value={mail} onChange={(e) => {setMail(e.target.value); errReset();}}/>
          </div>
          <div className='password'>
            <label>パスワード</label>
            <input type={passwordType.type} id='password' className={password.length > 0 ? 'entered' : ''} placeholder='パスワードを入力(8桁以上)' value={password} onChange={(e) => {setPassword(e.target.value); errReset();}}/>
            {password.length > 0 &&
              <span className='visible' onClick={passwordTypeHandler}>
                { passwordType.visible ? <VisibilityIcon sx={{ fontSize: 16 }}/> : <VisibilityOffIcon sx={{ fontSize: 16 }}/> }
              </span>
            }
          </div>
          <div className='terms-check'>
            <Checkbox className='icon' value={termsCheck} onChange={checkHandler}/>
            <span>
              <span className='policy' onClick={() => window.open('/policy?close=true', '_blank')}>利用規約</span>に同意する
            </span>
          </div>
          <div className='err-area'> 
            {errMsg && <p className='errmsg'>{errMsg}</p>}     
          </div>
          <button type='submit' className={termsCheck ? 'submit' : 'submit disabled'}>登録</button>
        </form>
      }
    </section>
    </>
  )
}