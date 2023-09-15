import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { UserState } from "store/types/UserActionTypes";
import { userLogin, userLogout } from "store/actions/userActions";
import { showTopPopup } from "store/actions/popupActions";
import { ApiResponse, ApiRoutes } from 'api/Api';
import axios from 'axios';

export default function useAuthService() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  async function login(mail: string, password: string): Promise<any> {
    try {
      const response = await axios.post<ApiResponse>(ApiRoutes.LOGIN, {
        mail,
        password,
      });
      if (response && !response.data?.hasErrors) {
        const current = new Date();
        const userInfo = response.data.responseData;
        const jwtInfo = {
          userId: userInfo.userId,
          mail: userInfo.mail,
          iat: current.getTime(),
          lat: current.getTime() + (1000*60*60*24),
        };
        localStorage.setItem('jwtInfo', JSON.stringify(jwtInfo));
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        dispatch(userLogin(userInfo));
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  async function logout(isSendReq: boolean): Promise<any> {
    if (isSendReq) {
      try {
        const response = await axios.post<ApiResponse>(ApiRoutes.LOGOUT);
        storageClear();
        if (response && !response.data?.hasErrors) {
          return response.data;
        }
      } catch (err) {
        storageClear();
        return null;
      }
    } else {
      storageClear();
    }
  }

  async function submit(name: string, mail: string, password: string): Promise<any> {
    try {
      const response = await axios.post<ApiResponse>(ApiRoutes.SUBMIT, {
        name,
        mail,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  }

  async function recoverMail(mail: string): Promise<any> {
    try {
      const response = await axios.post<ApiResponse>(ApiRoutes.RECOVER, {
        mail,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending recovery email:', error);
    }
  }

  async function recover(mail: string, password: string): Promise<any> {
    try {
      const response = await axios.patch<ApiResponse>(ApiRoutes.RECOVER, {
        mail,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Error recovering password:', error);
    }
  }

  async function keyCheck(mail: string, mailKey: string): Promise<any> {
    try {
      const response = await axios.post<ApiResponse>(ApiRoutes.KEY_CHECK, {
        mail,
        mailKey,
      });
      return response.data;
    } catch (error) {
      console.error('Error checking key:', error);
    }
  }

  async function refreshToken(): Promise<any> {
    try {
      const response = await axios.get<ApiResponse>(ApiRoutes.REFRESH_TOKEN);
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }

  async function healthCheck(): Promise<any> {
    try {
      const response = await axios.get<ApiResponse>(ApiRoutes.HEALTH_CHECK);
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
    }
  }

  function loginRequire(): boolean {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      return true;
    } else {
      dispatch(showTopPopup('ログインが必要です'));
      navigate('/login', { state: { prev: location.pathname } });
      return false;
    }
  }

  function getCurrentUser(): UserState | undefined {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      return JSON.parse(currentUser);
    } else {
      return undefined;
    }
  }

  function storageClear(): void {
    localStorage.removeItem('jwtInfo');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('prev');
    dispatch(userLogout());
  }

  return {
    login,
    logout,
    submit,
    recoverMail,
    recover,
    keyCheck,
    refreshToken,
    healthCheck,
    loginRequire,
    getCurrentUser,
  };
}