import { ReactElement } from 'react';
import { useNavigate } from "react-router-dom";
import './Complete.scss';

export interface CompleteItem {
  icon: ReactElement<any, any>;
  title: string;
  subTitle: string;
  path: string;
}

export default function Complete({ icon, title, subTitle, path }: CompleteItem) {
  const navigate = useNavigate();

  return(
    <div className='complete'>
      <div className='icon-area'>
        { icon }
      </div>
      <p className='complete-title'>{ title }</p>
      <p className='complete-sub-title'>{ subTitle }</p>
      {path === 'login' && <button className='next' onClick={() => navigate('/login', { replace: true })}>ログイン</button>}
      {path === 'home' && <button className='next' onClick={() => navigate('/', { replace: true })}>ホーム画面へ</button>}
    </div>
  )
}