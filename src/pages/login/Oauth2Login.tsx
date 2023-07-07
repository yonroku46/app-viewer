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

  useEffect(() => {
    navigate(`/login?type=${type}&code=${code}`, { replace: true, state: 'oauth2' });
  }, []);

  return(
    <Backdrop open={true} loading={true}/>
  )
}