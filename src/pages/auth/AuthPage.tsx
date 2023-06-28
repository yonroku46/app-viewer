import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Backdrop from 'components/backdrop/Backdrop';
import AuthService from 'api/service/AuthService';
import { useDispatch } from "react-redux";
import { showTopPopup, showCenterLinkPopup } from "redux/actions/popupActions";
import './AuthPage.scss';

import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [auth, setAuth] = useState<boolean>(false);
  const authService = new AuthService();

  const message: string = '登録が完了しました';
  
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
        setAuth(true)
        dispatch(showTopPopup('認証完了'));
      } else {
        dispatch(showCenterLinkPopup('失敗', '権限がないか\n存在しないコードです', '/'));
      }
    });
  }

  return(
    <>
    <Backdrop open={loading} loading={loading}/>
    <section className='auth fullsize'>
      {auth && 
        <>
        <div className='icon-area'>
          <MarkEmailReadIcon className='icon' sx={{ fontSize: 80 }}/>
        </div>
        <p className='message'>{ message }</p>
        <button className='next' onClick={() => navigate('/')}>ホーム画面へ</button>
        </>
      }
    </section>
    </>
  )
}