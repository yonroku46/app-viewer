import { useDispatch } from "react-redux";
import { userLogin } from "store/actions/userActions";
import { ApiResponse, ApiRoutes } from 'api/Api';
import axios from 'axios';

export default function OAuth2Service() {
  const dispatch = useDispatch();

  async function lineAccess(code: string): Promise<any> {
    const params = {
      code: code
    }
    try {
      const response = await axios.get<ApiResponse>(ApiRoutes.LINE_ACCESS_TOKEN, { params });
      if (response && !response.data?.hasErrors) {
        const current = new Date();
        const userInfo = response.data.responseData;
        const jwtInfo = {
          userId: userInfo.userId,
          mail: userInfo.mail,
          iat: current.getTime(),
          lat: current.getTime() + (1000*60*60*24)
        }
        localStorage.setItem('jwtInfo', JSON.stringify(jwtInfo));
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        dispatch(userLogin(userInfo));
      }
      return response.data;
    } catch (error) {
      console.error('Error accessing LINE:', error);
    }
  }
  
  async function googleAccess(code: string): Promise<any> {
    const params = {
      code: code
    }
    try {
      const response = await axios.get<ApiResponse>(ApiRoutes.GOOGLE_ACCESS_TOKEN, { params });
      if (response && !response.data?.hasErrors) {
        const current = new Date();
        const userInfo = response.data.responseData;
        const jwtInfo = {
          userId: userInfo.userId,
          mail: userInfo.mail,
          iat: current.getTime(),
          lat: current.getTime() + (1000*60*60*24)
        }
        localStorage.setItem('jwtInfo', JSON.stringify(jwtInfo));
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        dispatch(userLogin(userInfo));
      }
      return response.data;
    } catch (error) {
      console.error('Error accessing Google:', error);
    }
  }

  return {
    lineAccess,
    googleAccess,
  };
}