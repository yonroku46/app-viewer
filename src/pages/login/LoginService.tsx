import axios from 'axios';
import Api, { Response, ResponseData, Mapping } from '../../services/Api';

export default class LoginService {

  static async login(userMail: string, userPw: string): Promise<ResponseData> {
    const response = await axios.post<Response>(
      Api.getUrl(Mapping.LOGIN), {
      userMail,
      userPw,
    });
    return response.data.responseData;
  }

}