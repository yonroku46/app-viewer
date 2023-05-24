import { useEffect, useRef } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosHeaders, AxiosResponse } from 'axios';
import { Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogin } from "../../redux/actions/userActions";
import AuthService from '../../shared/service/AuthService';

interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosHeaders;
}

export function HttpApiInterceptor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isRefreshing = useRef(false);
  const refreshTokenSubject = useRef(new BehaviorSubject<any>(null));
  const authenticationService = new AuthService();
  const requestInterceptorId = useRef<number>();
  const responseInterceptorId = useRef<number>();

  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_BASE;
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    const interceptor = axios.interceptors.request.use(interceptRequest, interceptError);
    requestInterceptorId.current = interceptor;
    const responseInterceptor = axios.interceptors.response.use(interceptResponse, interceptError);
    responseInterceptorId.current = responseInterceptor;

    return () => {
      if (requestInterceptorId.current !== undefined) {
        axios.interceptors.request.eject(requestInterceptorId.current);
      }
      if (responseInterceptorId.current !== undefined) {
        axios.interceptors.response.eject(responseInterceptorId.current);
      }
    };
  }, []);

  function interceptRequest(config: AxiosRequestConfig): InternalAxiosRequestConfig {
    const currentUser = authenticationService.getCurrentUser();
    config.headers = config.headers || {} as AxiosHeaders;
    config.headers.Authorization = `Bearer ${currentUser ? currentUser.token : ''}`;
    config.headers.RefreshToken = `Bearer ${currentUser ? currentUser.refreshToken : ''}`;
    return config as InternalAxiosRequestConfig;
  }
  
  function interceptResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  function interceptError(error: AxiosError): Observable<AxiosResponse<any, any>> {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return handle401Error(error);
        case 403:
          handle403Error();
          break;
        case 409:
          handle409Error();
          break;
        default:
          break;
      }
    }
    return throwError(error);
  }

  function handle401Error(error: AxiosError): Observable<AxiosResponse<any, any>> {
    if (!isRefreshing.current) {
      isRefreshing.current = true;
      refreshTokenSubject.current.next(null);

      return from(authenticationService.refreshToken()).pipe(
        switchMap((response: AxiosResponse) => {
          isRefreshing.current = false;
          if (response && !response.data.hasErrors) {
            localStorage.setItem('currentUser', JSON.stringify(response.data.responseData));
            dispatch(userLogin(response.data.responseData));
            refreshTokenSubject.current.next(response.data.responseData.token);
            return axios(addToken(error.config));
          } else {
            authenticationService.logout(false);
            navigate('login');
            return throwError(response);
          }
        })
      );
    } else {
      return refreshTokenSubject.current.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => {
          return axios(addToken(error.config));
        })
      );
    }
  }

  function handle403Error(): void {
    navigate('');
  }

  function handle409Error(): void {
    authenticationService.logout(false);
    navigate('login');
  }

  function addToken(config: AxiosRequestConfig | undefined): InternalAxiosRequestConfig | {} {
    if (config) {
      const currentUser = authenticationService.getCurrentUser();
      config.headers = config.headers || {}; 
      config.headers.Authorization = `Bearer ${currentUser ? currentUser.token : ''}`;
      config.headers.RefreshToken = `Bearer ${currentUser ? currentUser.refreshToken : ''}`;
      return config as InternalAxiosRequestConfig;
    } else {
      return {};
    }
  }

  return {
    releaseInterceptors: () => {
      if (requestInterceptorId.current !== undefined) {
        axios.interceptors.request.eject(requestInterceptorId.current);
      }
      if (responseInterceptorId.current !== undefined) {
        axios.interceptors.response.eject(responseInterceptorId.current);
      }
    }
  };
}