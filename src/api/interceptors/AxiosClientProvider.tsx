import React, { useEffect } from 'react'
import axios, { AxiosError, AxiosRequestConfig, AxiosHeaders, AxiosResponse } from 'axios';
import { Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom'
import { userLogin } from "../../redux/actions/userActions";
import { showCenterPopup } from "../../redux/actions/popupActions";
import AuthService from '../../shared/service/AuthService';

interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosHeaders;
}

// デフォルト config の設定
export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  }
})

export function AxiosClientProvider({ children }: { children: React.ReactNode }): JSX.Element {
  // 関数コンポーネントなのでフックが使える
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();
  const authenticationService = new AuthService();

  let isRefreshing = false;
  let refreshTokenSubject = new BehaviorSubject<any>(null);

  function openCenterPopup(title: string, contents: string) {
    dispatch(showCenterPopup(title, contents));
  }
 
  useEffect(() => {
    // const currentUser = authenticationService.getCurrentUser();
    // axiosClient.defaults.headers.common["Authorization"] = `Bearer ${currentUser ? currentUser.token : ''}`;
    // axiosClient.defaults.headers.common["RefreshToken"] = `Bearer ${currentUser ? currentUser.refreshToken : ''}`;
    // リクエスト インターセプター
    const requestInterceptors = axiosClient.interceptors.request.use(
      (config) => {
        if (config.headers) {
          const currentUser = authenticationService.getCurrentUser();
          config.headers.Authorization = `Bearer ${currentUser ? currentUser.token : ''}`;
          config.headers.RefreshToken = `Bearer ${currentUser ? currentUser.refreshToken : ''}`;
        }
        return config;
      }
    );

    // レスポンス インターセプター
    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        switch (error.response?.status) {
          case 401:
            return handle401Error(error);
          case 403:
            handle403Error();
            break;
          case 409:
            handle409Error();
            break;
          default:
            handleDefaultError(error);
            break;
        }
        return Promise.reject(error);
      }
    )

    // クリーンアップ
    return () => {
      axiosClient.interceptors.request.eject(requestInterceptors)
      axiosClient.interceptors.response.eject(responseInterceptor)
    }
  }, [location.pathname])

  function handle401Error(error: AxiosError): Observable<AxiosResponse<any, any>> {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      return from(authenticationService.refreshToken()).pipe(
        switchMap((response: AxiosResponse) => {
          isRefreshing = false;
          if (response && !response.data.hasErrors) {
            localStorage.setItem('currentUser', JSON.stringify(response.data.responseData));
            dispatch(userLogin(response.data.responseData));
            refreshTokenSubject.next(response.data.responseData.token);
            return axios(addToken(error.config));
          } else {
            authenticationService.logout(false);
            openCenterPopup('セッション満了', 'もう一度ログインをお願いします。');
            navigate('/login');
            return throwError(response);
          }
        })
      );
    } else {
      return refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => {
          return axios(addToken(error.config));
        })
      );
    }
  }

  function handle403Error(): void {
    navigate('/');
  }

  function handle409Error(): void {
    authenticationService.logout(false);
    navigate('/login');
  }

  function handleDefaultError(error: AxiosError): void {
    const status = error.response?.status;
    openCenterPopup(`${status}`, '予想しないエラーが発生しました。\n続く場合、管理者に問い合わせください。');
  }

  function addToken(config: AxiosRequestConfig | undefined): InternalAxiosRequestConfig | {} {
    if (config) {
      const currentUser = authenticationService.getCurrentUser();
      const headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${currentUser ? currentUser.token : ''}`,
        RefreshToken: `Bearer ${currentUser ? currentUser.refreshToken : ''}`
      };
      return {
        ...config,
        headers: headers
      };
    } else {
      return {};
    }
  }
 
  return <>{children}</>;
}