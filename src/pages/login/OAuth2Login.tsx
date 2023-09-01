import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Backdrop from 'components/backdrop/Backdrop';
import './Login.scss';

export default function OAuth2Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();
  
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const prev = localStorage.getItem('prev');

  useEffect(() => {
    navigate(`/login?type=${type}&code=${code}`, { replace: true, state: { auth: 'oauth2', prev: prev === 'undefined' ? undefined : prev } });
  }, []);

  return(
    <Backdrop open={true}/>
  )
}