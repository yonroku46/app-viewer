import axios from 'axios';

interface UserData {
  userMail: string;
  userName: string;
}

export default class LoginService {

  static async login(userMail: string, userPw: string): Promise<UserData> {
    const response = await axios.post<UserData>('/api/login', {
      userMail,
      userPw,
    });
    return response.data;
  }

}