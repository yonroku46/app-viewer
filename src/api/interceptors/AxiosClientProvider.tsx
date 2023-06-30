import React, { useEffect, useRef } from 'react'
import axios, { AxiosError, AxiosRequestConfig, AxiosHeaders, AxiosResponse } from 'axios';
import { Observable, BehaviorSubject, throwError, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { filter, switchMap, take } from 'rxjs/operators';
import { useDispatch } from "react-redux";
import { userLogin } from "redux/actions/userActions";
import { showCenterPopup, showCenterLinkPopup } from "redux/actions/popupActions";
import AuthService from 'api/service/AuthService';

interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosHeaders;
}

export function AxiosClientProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const dispatch = useDispatch()

  const authService = new AuthService();
  
  const isRefreshing = useRef<boolean>(false);
  let refreshTokenSubject = new BehaviorSubject<any>(null);

  // クリーンアップ
  useEffect(() => {
    return () => {
      axios.interceptors.request.eject(requestInterceptors)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [])
 
  // デフォルト設定
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE;
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

  // リクエストインターセプター
  const requestInterceptors = axios.interceptors.request.use(
    (config) => {
      if (config.headers) {
        const currentUser = authService.getCurrentUser();
        config.headers.Authorization = `Bearer ${currentUser ? currentUser.token : ''}`;
        config.headers.RefreshToken = `Bearer ${currentUser ? currentUser.refreshToken : ''}`;
      }
      return config;
    }
  );

  // レスポンスインターセプター
  const responseInterceptor = axios.interceptors.response.use(
    (response) => {
      return response;
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

  function openPopup(title: string, contents: string, link?: string) {
    if (link) {
      dispatch(showCenterLinkPopup(title, contents, link));
    } else {
      dispatch(showCenterPopup(title, contents));
    }
  }

  async function handle401Error(error: AxiosError): Promise<Observable<AxiosResponse<any, any>>> {
    if (!isRefreshing.current) {
      isRefreshing.current = true;
      refreshTokenSubject.next(null);
      try {
        const response = await from(authService.refreshToken()).pipe(
          take(1)
        ).toPromise();
        isRefreshing.current = false;
        if (response && !response.hasErrors) {
          localStorage.setItem('currentUser', JSON.stringify(response.responseData));
          dispatch(userLogin(response.responseData));
          refreshTokenSubject.next(response.responseData.token);
          return axios(addToken(error.config));
        } else {
          authService.logout(false);
          openPopup('セッション満了', 'セッションエラーが発生しました。\nもう一度ログインをお願いします。', '/login');
          return throwError(response);
        }
      } catch (error: any) {
        handleDefaultError(error);
        return throwError(error);
      }
    } else {
      return refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => {
          return axios(addToken(error.config));
        }),
        catchError((error: any) => {
          handleDefaultError(error);
          return throwError(error);
        })
      );
    }
  }

  function handle403Error(): void {
    openPopup('不正アクセス', 'アクセス権限がありません。', '/');
  }

  function handle409Error(): void {
    authService.logout(false);
    openPopup('エラー', 'エラーが発生しました。\nもう一度ログインをお願いします。', '/login');
  }

  function handleDefaultError(error: AxiosError): void {
    const status = error.response?.status;
    openPopup(`${status}`, '予想しないエラーが発生しました。\n続く場合、管理者に問い合わせください。');
  }

  function addToken(config: AxiosRequestConfig | undefined): InternalAxiosRequestConfig | {} {
    const currentUser = authService.getCurrentUser();
    if (config) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${currentUser ? currentUser.token : ''}`;
        config.headers.RefreshToken = `Bearer ${currentUser ? currentUser.refreshToken : ''}`;
      }
      return config;
    } else {
      return {};
    }
  }
 
  return <>{children}</>;
}