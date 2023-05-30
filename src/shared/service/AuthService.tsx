import { useDispatch } from "react-redux";
import { UserState } from "../../redux/actions/types/UserActionTypes";
import { userLogin, userLogout } from "../../redux/actions/userActions";
import { ApiResponse, ApiMap } from '../../api/Api';
import { axiosClient } from "../../api/interceptors/AxiosClientProvider";

export default class AuthService {
  dispatch = useDispatch();

  getCurrentUser(): UserState | undefined {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      return JSON.parse(currentUser);
    } else {
      return undefined;
    }
  }

  async login(mail: string, password: string): Promise<any> {
    return axiosClient.post<ApiResponse>(ApiMap.LOGIN, {
      mail,
      password,
    }).then(response => {
      if (response && !response.data.hasErrors) {
        const current = new Date();
        const userInfo = response.data.responseData;
        var jwtInfo = {
          uid: userInfo.uid,
          mail: userInfo.mail,
          iat: current.getTime(),
          lat: current.getTime() + (2*60*60*1000)
        }
        localStorage.setItem('jwtInfo', JSON.stringify(jwtInfo));
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        this.dispatch(userLogin(userInfo));
      }
      return response.data;
    });
  }

  async logout(isSendReq: boolean): Promise<any> {
    if (isSendReq) {
      return axiosClient.post<ApiResponse>(ApiMap.LOGOUT)
      .then(response => {
          this.storageClear();
          if (response) {
            return response.data;
          }
        }).catch(err => {
          this.storageClear();
          return null;
        });
      }
    this.storageClear();
  }

  async refreshToken(): Promise<any> {
    return axiosClient.get<ApiResponse>(ApiMap.REFRESH_TOKEN);
  }

  async healthCheck(): Promise<any> {
    return axiosClient.get<ApiResponse>(ApiMap.HEALTH_CHECK)
    .then(response => {
      return response.data;
    });
  }

  storageClear(): void {
    localStorage.removeItem('jwtInfo');
    localStorage.removeItem('currentUser');
    this.dispatch(userLogout());
  }
}