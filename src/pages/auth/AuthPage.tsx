import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Backdrop from 'components/backdrop/Backdrop';
import Complete from 'components/auth/Complete';
import AuthService from 'api/service/AuthService';
import { useDispatch } from "react-redux";
import { showTopPopup, showCenterLinkPopup } from "redux/actions/popupActions";
import './AuthPage.scss';

import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

export default function AuthPage() {
  const dispatch = useDispatch();
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  
  const authService = new AuthService();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
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
        setIsComplete(true)
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
      {isComplete && 
        <Complete icon={<MarkEmailReadIcon className='icon' sx={{ fontSize: 80 }}/>} title={'登録完了'} subTitle={'ご登録頂きありがとうございます'} path={'home'}/>
      }
    </section>
    </>
  )
}