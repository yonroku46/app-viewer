import axios, { AxiosResponse } from 'axios';
import { useDispatch } from "react-redux";
import { UserState } from "../../redux/actions/types/UserActionTypes";
import { userLogin, userLogout } from "../../redux/actions/userActions";
import Api, { ApiResponse, ApiMapping } from '../../api/Api';

export default class AuthService {

  dispatch = useDispatch();

  async login(mail: string, password: string): Promise<any> {
    await axios.post<ApiResponse>(
      Api.getUrl(ApiMapping.LOGIN), {
      mail,
      password,
    }).then(response => {
      console.log(response)
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

  async logout(isSendReq: boolean) {
    if (isSendReq) {
      await axios.post<Response>(
        Api.getUrl(ApiMapping.LOGOUT), {
      });
    }
    localStorage.removeItem('jwtInfo');
    localStorage.removeItem('currentUser');
    this.dispatch(userLogout());
  }

  getCurrentUser(): UserState | undefined {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      return JSON.parse(currentUser);
    } else {
      return undefined;
    }
  }

  refreshToken(): Promise<AxiosResponse<ApiResponse, any>> {
    return axios.get<ApiResponse>(
      Api.getUrl(ApiMapping.REFRESH_TOKEN), {
    });
  }
}