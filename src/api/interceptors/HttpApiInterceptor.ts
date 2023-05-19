import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogin } from "../../redux/actions/userActions";
import AuthService from '../../shared/service/AuthService';

export class HttpApiInterceptor {

  private navigate = useNavigate();
  private dispatch = useDispatch();
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private authenticationService = new AuthService();
  private requestInterceptorId: number;
  private responseInterceptorId: number;

  constructor() {
    this.interceptRequest = this.interceptRequest.bind(this);
    this.interceptResponse = this.interceptResponse.bind(this);
    this.interceptError = this.interceptError.bind(this);
    this.handle401Error = this.handle401Error.bind(this);
    this.handle403Error = this.handle403Error.bind(this);
    this.handle409Error = this.handle409Error.bind(this);
    this.addToken = this.addToken.bind(this);

    this.requestInterceptorId = axios.interceptors.request.use(this.interceptRequest);
    this.responseInterceptorId = axios.interceptors.response.use(this.interceptResponse, this.interceptError);  
  }

  interceptRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const currentUser = this.authenticationService.getCurrentUser();
    config.headers.Authorization = `Bearer ${currentUser ? currentUser.token : ''}`;
    config.headers.RefreshToken = `Bearer ${currentUser ? currentUser.refreshToken : ''}`;
    return config;
  };
  
  interceptResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  interceptError(error: AxiosError): Observable<AxiosResponse<any, any>> {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return this.handle401Error(error);
        case 403:
          this.handle403Error();
          break;
        case 409:
          this.handle409Error();
          break;
        default:
          break;
      }
    }
    return throwError(error);
  }

  releaseInterceptors() {
    axios.interceptors.request.eject(this.requestInterceptorId);
    axios.interceptors.response.eject(this.responseInterceptorId);
  }

  private handle401Error(error: AxiosError): Observable<AxiosResponse<any, any>> {
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
            this.navigate('login');
            return throwError(response);
          }
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(() => {
          return axios(this.addToken(error.config));
        })
      );
    }
  }

  private handle403Error(): void {
    this.navigate('');
  }

  private handle409Error(): void {
    this.authenticationService.logout(false);
    this.navigate('login');
  }

  private addToken(config: InternalAxiosRequestConfig | undefined): InternalAxiosRequestConfig | {} {
    if (config) {
      const currentUser = this.authenticationService.getCurrentUser();
      config.headers.Authorization = `Bearer ${currentUser ? currentUser.token : ''}`;
      config.headers.RefreshToken = `Bearer ${currentUser ? currentUser.refreshToken : ''}`;
      return config;
    } else {
      return {};
    }
  };
  
}