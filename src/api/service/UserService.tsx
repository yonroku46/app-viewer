import { useDispatch } from "react-redux";
import { userLogin } from "store/actions/userActions";
import { ApiResponse, ApiRoutes } from 'api/Api';
import axios from 'axios';

export interface UserInfo {
  userName: boolean;
  mail?: string;
}

export default class UserService {
  dispatch = useDispatch();

  async getUserInfo(): Promise<any> {
    return axios.get<ApiResponse>(ApiRoutes.USER_INFO)
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }

  async updateUserInfo(profileImg: FormData): Promise<any> {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    };
    return axios.patch<ApiResponse>(ApiRoutes.USER_INFO, profileImg, config)
    .then(response => {
      if (response && !response.data?.hasErrors) {
        const current = new Date();
        const userInfo = response.data.responseData;
        var jwtInfo = {
          userId: userInfo.userId,
          mail: userInfo.mail,
          iat: current.getTime(),
          lat: current.getTime() + (1000*60*60*24)
        }
        localStorage.setItem('jwtInfo', JSON.stringify(jwtInfo));
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        this.dispatch(userLogin(userInfo));
      }
      return response.data;
    });
  }
}