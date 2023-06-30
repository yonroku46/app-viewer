import React, { useState } from 'react';
import Backdrop from 'components/backdrop/Backdrop';
import Complete from 'components/auth/Complete';
import AuthService from 'api/service/AuthService';
import './Recover.scss';

import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';

export default function Recover() {

  const authService = new AuthService();

  const [mail, setMail] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    errReset();
    if (mail === "") {
      setErrMsg("メールを入力してください");
      return;
    }
    recoverMail();
  }

  async function recoverMail() {
    setLoading(true);
    await authService.recoverMail(mail).then(data => {
      setLoading(false);
      if (data.responseData) {
        errReset();
        setIsComplete(true);
      } else {
        setErrMsg('登録されていないメールアドレスです');
      }
    });
  }

  function errReset() {
    setErrMsg('');
  }

  return(
    <>
    <Backdrop open={loading} loading={loading}/>
    <section className='recover fullsize'>
      {isComplete ?
        <Complete icon={<ForwardToInboxIcon className='icon' sx={{ fontSize: 80 }}/>} title={'メールを送信しました'} subTitle={'完了させるためには\nメールでの認証が必要です'} path={'login'}/>
        :
        <form className='recover-form' onSubmit={onSubmitHandler}>
          <div className='sub-title'>
            Recover
          </div>
          <div className='title'>
            パスワード再発行
          </div>
          <div className='email'>
            <label>メールアドレス</label>
            <input type='email' id='email' className={mail.length > 0 ? 'entered' : ''} placeholder='メールアドレスを入力' value={mail} onChange={(e) => {setMail(e.target.value); errReset();}}/>
          </div>
          <div className='err-area'>
            {errMsg && <p className='errmsg'>{errMsg}</p>}     
          </div>
          <button type='submit' className='next'>送信</button>
        </form>
      }
    </section>
    </>
  )
}