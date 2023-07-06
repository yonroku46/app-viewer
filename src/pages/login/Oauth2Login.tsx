import { useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import Backdrop from 'components/backdrop/Backdrop';
import './Login.scss';

export default function Oauth2Login() {
  const location = useLocation();
  const { type } = useParams();
  
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  useEffect(() => {
    if (type === 'success') {
      const data = true;
      window.opener?.postMessage({ data }, '*');
      window.close();
    } else if (type === 'line') {
      window.opener?.postMessage({ code, state }, '*');
      window.close();
    } else if (type === 'google') {
      window.opener?.postMessage({ code, state }, '*');
      window.close();
    }
  }, []);

  return(
    <Backdrop open={true} loading={true}/>
  )
}