import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom';
import AuthComplete from 'components/auth/AuthComplete';
import AuthService from 'api/service/AuthService';
import { showTopPopup, showCenterLinkPopup } from "store/actions/popupActions";
import { loading, unloading } from "store/actions/loadingActions";
import './AuthPage.scss';

import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

export default function AuthPage() {
  const dispatch = useDispatch();
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  
  const authService = AuthService();
  
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  useEffect(() => {
    const key = query.get('k');
    const mail = query.get('m');
    if (mail && key) {
      keyCheck(mail, key);
    }
  }, []);

  async function keyCheck(mail: string, key: string) {
    dispatch(loading(true, true));
    await authService.keyCheck(mail, key).then(data => {
      dispatch(unloading());
      if (data.responseData) {
        setIsComplete(true)
        dispatch(showTopPopup('認証完了'));
      } else {
        dispatch(showCenterLinkPopup('失敗', '権限がないか\n存在しないコードです', '/'));
      }
    });
  }

  return(
    <section className='auth fullsize'>
      {isComplete && 
        <AuthComplete icon={<MarkEmailReadIcon className='icon' sx={{ fontSize: 80 }}/>} title={'登録完了'} subTitle={'ご登録頂きありがとうございます'} path={'home'}/>
      }
    </section>
  )
}