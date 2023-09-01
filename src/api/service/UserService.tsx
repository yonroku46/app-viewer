import { useDispatch } from 'react-redux';
import { userLogin } from 'store/actions/userActions';
import { ApiResponse, ApiRoutes } from 'api/Api';
import axios from 'axios';

export interface UserInfo {
  userName: boolean;
  mail?: string;
}

export default function UserService() {
  const dispatch = useDispatch();

  async function getUserInfo(): Promise<any> {
    try {
      const response = await axios.get<ApiResponse>(ApiRoutes.USER_INFO);
      if (response && !response.data?.hasErrors) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }

  async function updateUserInfo(profileImg: FormData): Promise<any> {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    try {
      const response = await axios.patch<ApiResponse>(
        ApiRoutes.USER_INFO,
        profileImg,
        config
      );
      if (response && !response.data?.hasErrors) {
        const current = new Date();
        const userInfo = response.data.responseData;
        const jwtInfo = {
          userId: userInfo.userId,
          mail: userInfo.mail,
          iat: current.getTime(),
          lat: current.getTime() + 1000 * 60 * 60 * 24,
        };
        localStorage.setItem('jwtInfo', JSON.stringify(jwtInfo));
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        dispatch(userLogin(userInfo));
      }
      return response.data;
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  }

  return {
    getUserInfo,
    updateUserInfo,
  };
}