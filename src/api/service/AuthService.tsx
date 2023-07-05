import { useDispatch } from "react-redux";
import { UserState } from "redux/types/UserActionTypes";
import { userLogin, userLogout } from "redux/actions/userActions";
import { ApiResponse, ApiRoutes } from 'api/Api';
import axios from 'axios';

export default class AuthService {
  dispatch = useDispatch();

  async login(mail: string, password: string): Promise<any> {
    return axios.post<ApiResponse>(ApiRoutes.LOGIN, {
      mail,
      password,
    }).then(response => {
      if (response && !response.data?.hasErrors) {
        const current = new Date();
        const userInfo = response.data.responseData;
        var jwtInfo = {
          userId: userInfo.userId,
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
      return axios.post<ApiResponse>(ApiRoutes.LOGOUT)
      .then(response => {
        this.storageClear();
        if (response && !response.data?.hasErrors) {
          return response.data;
        }
      }).catch(err => {
        this.storageClear();
        return null;
      });
    }
    this.storageClear();
  }

  async submit(name: string, mail: string, password: string): Promise<any> {
    return axios.post<ApiResponse>(ApiRoutes.SUBMIT, {
      name,
      mail,
      password,
    })
    .then(response => {
      return response.data;
    });
  }

  async recoverMail(mail: string): Promise<any> {
    return axios.post<ApiResponse>(ApiRoutes.RECOVER, {
      mail,
    })
    .then(response => {
      return response.data;
    });
  }

  async recover(mail: string, password: string): Promise<any> {
    return axios.patch<ApiResponse>(ApiRoutes.RECOVER, {
      mail,
      password,
    })
    .then(response => {
      return response.data;
    });
  }

  async keyCheck(mail: string, mailKey: string): Promise<any> {
    return axios.post<ApiResponse>(ApiRoutes.KEY_CHECK, {
      mail,
      mailKey,
    })
    .then(response => {
      return response.data;
    });
  }

  async refreshToken(): Promise<any> {
    return axios.get<ApiResponse>(ApiRoutes.REFRESH_TOKEN)
    .then(response => {
      return response.data;
    });
  }

  async healthCheck(): Promise<any> {
    return axios.get<ApiResponse>(ApiRoutes.HEALTH_CHECK)
    .then(response => {
      return response.data;
    });
  }

  getCurrentUser(): UserState | undefined {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      return JSON.parse(currentUser);
    } else {
      return undefined;
    }
  }

  storageClear(): void {
    localStorage.removeItem('jwtInfo');
    localStorage.removeItem('currentUser');
    this.dispatch(userLogout());
  }
}