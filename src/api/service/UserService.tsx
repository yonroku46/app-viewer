import { useDispatch } from "react-redux";
import { ApiResponse, ApiRoutes } from 'api/Api';
import axios from 'axios';

export interface UserInfo {
  userName: boolean;
  mail?: string;
}

export default class UserService {
  dispatch = useDispatch();

  async userInfo(): Promise<any> {
    return axios.get<ApiResponse>(ApiRoutes.USER_INFO)
    .then(response => {
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    });
  }
}