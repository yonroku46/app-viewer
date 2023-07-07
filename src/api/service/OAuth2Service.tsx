import { useDispatch } from "react-redux";
import { userLogin } from "redux/actions/userActions";
import { ApiResponse, ApiRoutes } from 'api/Api';
import axios from 'axios';

export default class OAuth2Service {
  dispatch = useDispatch();

  async lineAccess(code: string): Promise<any> {
    const params = {
      code: code
    }
    return axios.get<ApiResponse>(ApiRoutes.LINE_ACCESS_TOKEN, {params})
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
  
  async googleAccess(code: string): Promise<any> {
    const params = {
      code: code
    }
    return axios.get<ApiResponse>(ApiRoutes.GOOGLE_ACCESS_TOKEN, {params})
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