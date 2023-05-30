import { useDispatch } from "react-redux";
import { ApiResponse, ApiMap } from '../../api/Api';
import { axiosClient } from "../../api/interceptors/AxiosClientProvider";

export interface UserInfo {
  userName: boolean;
  mail?: string;
}

export default class UserService {
  dispatch = useDispatch();

  async userInfo(): Promise<any> {
    return axiosClient.get<ApiResponse>(ApiMap.USER_INFO)
    .then(response => {
      if (response && !response.data.hasErrors) {
        return response.data;
      }
    });
  }
}