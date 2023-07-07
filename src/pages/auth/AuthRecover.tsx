import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import Backdrop from 'components/backdrop/Backdrop';
import AuthComplete from 'components/auth/AuthComplete';
import AuthService from 'api/service/AuthService';
import { showTopPopup, showCenterLinkPopup } from "redux/actions/popupActions";
import './AuthRecover.scss';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

export default function AuthRecover() {
  const dispatch = useDispatch();
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  
  const authService = new AuthService();
  
  const [passwordType, setPasswordType] = useState<{type: string, visible: boolean}>({
    type: 'password',
    visible: false
  });
  const [rePasswordType, setRePasswordType] = useState<{type: string, visible: boolean}>({
    type: 'password',
    visible: false
  });
  const [auth, setAuth] = useState<boolean>(false);
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  function passwordTypeHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    setPasswordType(() => {
      if (!passwordType.visible) {
        return { type: 'text', visible: true };
      }
      return { type: 'password', visible: false };
    })
  }

  function rePasswordTypeHandler(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    setRePasswordType(() => {
      if (!rePasswordType.visible) {
        return { type: 'text', visible: true };
      }
      return { type: 'password', visible: false };
    })
  }
  
  useEffect(() => {
    const key = query.get('k');
    const mail = query.get('m');
    if (mail && key) {
      keyCheck(mail, key);
    }
  }, []);

  async function keyCheck(mail: string, key: string) {
    setLoading(true);
    await authService.keyCheck(mail, key).then(data => {
      setLoading(false);
      if (data.responseData) {
        setAuth(true);
        dispatch(showTopPopup('認証完了'));
        setMail(data.responseData.mail);
      } else {
        dispatch(showCenterLinkPopup('失敗', '権限がないか\n存在しないコードです', '/'));
      }
    });
  }

  function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password === "" || rePassword === "") {
      setErrMsg("パスワードを入力してください");
      return;
    } else if (password.length < 8) {
      setErrMsg("パスワードが短過ぎます");
      return;
    } else if (password.length > 50) {
      setErrMsg("パスワードが長過ぎます");
      return;
    } else if (password !== rePassword) {
      setErrMsg("パスワードが一致しません");
      return;
    }
    recover();
  }

  async function recover() {
    setLoading(true);
    await authService.recover(mail, password).then(data => {
      setLoading(false);
      if (data.responseData) {
        setIsComplete(true);
      }
    });
  }

  function errReset() {
    setErrMsg('');
  }

  return(
    <>
    <Backdrop open={loading} loading={loading}/>
    <section className='auth-recover fullsize'>
      {auth ?
       isComplete ?
        <AuthComplete icon={<PublishedWithChangesIcon className='icon' sx={{ fontSize: 80 }}/>} title={'パスワード変更完了'} subTitle={'新しいパスワードで\nログインしてください'} path={'login'}/>
        :
        <form className='auth-recover-form' onSubmit={onSubmitHandler}>
          <div className='sub-title'>
            Recover
          </div>
          <div className='title'>
            パスワード再設定
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
          <div className='password'>
            <label>パスワード再入力</label>
            <input type={rePasswordType.type} id='re-password' className={rePassword.length > 0 ? 'entered' : ''} placeholder='パスワードを再入力' value={rePassword} onChange={(e) => {setRePassword(e.target.value); errReset();}}/>
            {rePassword.length > 0 &&
              <span className='visible' onClick={rePasswordTypeHandler}>
                { rePasswordType.visible ? <VisibilityIcon sx={{ fontSize: 16 }}/> : <VisibilityOffIcon sx={{ fontSize: 16 }}/> }
              </span>
            }
          </div>
          <div className='err-area'> 
            {errMsg && <p className='errmsg'>{errMsg}</p>}     
          </div>
          <button type='submit' className='next'>変更</button>       
        </form>
        :
        <></>
      }
    </section>
    </>
  )
}