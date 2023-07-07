import { ReactElement } from 'react';
import { useNavigate } from "react-router-dom";
import './AuthComplete.scss';

export interface AuthCompleteItem {
  icon: ReactElement<any, any>;
  title: string;
  subTitle: string;
  path: string;
}

export default function AuthComplete({ icon, title, subTitle, path }: AuthCompleteItem) {
  const navigate = useNavigate();

  return(
    <div className='auth-complete'>
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