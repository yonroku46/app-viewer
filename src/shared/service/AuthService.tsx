import axios from 'axios';
import { useDispatch } from "react-redux";
import { UserState } from "../../redux/actions/types/UserActionTypes";
import { userLogin, userLogout } from "../../redux/actions/userActions";
import { ApiResponse, ApiMapping } from '../../api/Api';
import { apiUrl } from "../../shared/utils/Utils";

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
    return axios.post<ApiResponse>(
      apiUrl(ApiMapping.LOGIN), {
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
      return axios.post<ApiResponse>(
        apiUrl(ApiMapping.LOGOUT), {
        }).then(response => {
          localStorage.removeItem('jwtInfo');
          localStorage.removeItem('currentUser');
          this.dispatch(userLogout());
          if (response) {
            return response.data;
          }
        }).catch(err => {
          localStorage.removeItem('jwtInfo');
          localStorage.removeItem('currentUser');
          this.dispatch(userLogout());
          return null;
        });
      }
  }

  async refreshToken(): Promise<any> {
    return axios.get<ApiResponse>(
      apiUrl(ApiMapping.REFRESH_TOKEN), {
    });
  }

  async healthCheck(): Promise<any> {
    return axios.get<ApiResponse>(
      apiUrl(ApiMapping.API_CHECK)
    ).then(response => {
      return response.data;
    });
  }
}