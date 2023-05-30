import axios, { AxiosError, AxiosRequestConfig, AxiosHeaders, AxiosResponse } from 'axios';
import { Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showCenterPopup } from "../../redux/actions/popupActions";
import { userLogin } from "../../redux/actions/userActions";
import AuthService from '../../shared/service/AuthService';

interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosHeaders;
}

class HttpApiInterceptor {
  navigate = useNavigate();
  dispatch = useDispatch();
  isRefreshing = false;
  refreshTokenSubject = new BehaviorSubject<any>(null);
  authenticationService = new AuthService();
  requestInterceptorId?: number;
  responseInterceptorId?: number;

  constructor() {
    this.interceptRequest = this.interceptRequest.bind(this);
    this.interceptResponse = this.interceptResponse.bind(this);
    this.interceptError = this.interceptError.bind(this);
    this.handle401Error = this.handle401Error.bind(this);
    this.handle403Error = this.handle403Error.bind(this);
    this.handle409Error = this.handle409Error.bind(this);
    this.handleDefaultError = this.handleDefaultError.bind(this);
    this.addToken = this.addToken.bind(this);
    this.openCenterPopup = this.openCenterPopup.bind(this);
  }

  openCenterPopup(title: string, contents: string) {
    this.dispatch(showCenterPopup(title, contents));
  }

  interceptRequest(config: AxiosRequestConfig): InternalAxiosRequestConfig {
    const currentUser = this.authenticationService.getCurrentUser();
    if (config.headers) {
      config.headers.Authorization = `Bearer ${currentUser ? currentUser.token : ''}`;
      config.headers.RefreshToken = `Bearer ${currentUser ? currentUser.refreshToken : ''}`;
    }
    return config as InternalAxiosRequestConfig;
  }

  interceptResponse(response: AxiosResponse): AxiosResponse {
    return response as AxiosResponse;
  }

  interceptError(error: AxiosError): Observable<AxiosResponse<any, any>> {
    switch (error.response?.status) {
      case 401:
        return this.handle401Error(error);
      case 403:
        this.handle403Error();
        break;
      case 409:
        this.handle409Error();
        break;
      default:
        this.handleDefaultError(error);
        break;
    }
    return throwError(error);
  }

  handle401Error(error: AxiosError): Observable<AxiosResponse<any, any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return from(this.authenticationService.refreshToken()).pipe(
        switchMap((response: AxiosResponse) => {
          this.isRefreshing = false;
          if (response && !response.data.hasErrors) {
            localStorage.setItem('currentUser', JSON.stringify(response.data.responseData));
            this.dispatch(userLogin(response.data.responseData));
            this.refreshTokenSubject.next(response.data.responseData.token);
            return axios(this.addToken(error.config));
          } else {
            this.authenticationService.logout(false);
            this.openCenterPopup('セッション満了', 'もう一度ログインをお願いします。');
            this.navigate('/login');
            return throwError(response);
          }
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => {
          return axios(this.addToken(error.config));
        })
      );
    }
  }

  handle403Error(): void {
    this.navigate('/');
  }

  handle409Error(): void {
    this.authenticationService.logout(false);
    this.navigate('/login');
  }

  handleDefaultError(error: AxiosError): void {
    const status = error.response?.status;
    this.openCenterPopup(`${status}`, '予想しないエラーが発生しました。\n続く場合、管理者に問い合わせください。');
  }

  addToken(config: AxiosRequestConfig | undefined): InternalAxiosRequestConfig | {} {
    if (config) {
      const currentUser = this.authenticationService.getCurrentUser();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${currentUser ? currentUser.token : ''}`;
      config.headers.RefreshToken = `Bearer ${currentUser ? currentUser.refreshToken : ''}`;
      return config as InternalAxiosRequestConfig;
    } else {
      return {};
    }
  }

  initializeInterceptors(): void {
    axios.defaults.baseURL = process.env.REACT_APP_API_BASE;
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    this.requestInterceptorId = axios.interceptors.request.use(
      (config) => this.interceptRequest(config)
    );
  
    this.responseInterceptorId = axios.interceptors.response.use(
      (response) => this.interceptResponse(response),
      (error) => this.interceptError(error)
    );
  }

  releaseInterceptors(): void {
    if (this.requestInterceptorId !== undefined) {
      axios.interceptors.request.eject(this.requestInterceptorId);
    }
    if (this.responseInterceptorId !== undefined) {
      axios.interceptors.response.eject(this.responseInterceptorId);
    }
  }
}

export default HttpApiInterceptor;