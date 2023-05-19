export interface ApiResponse {
  errors: boolean,
  hasErrors: boolean,
  informations: [any],
  responseData: any,
  resultCode: number
}

export enum ApiMapping {
  // auth
  LOGIN = "auth/login",
  LOGOUT = "auth/logout",
  REFRESH_TOKEN = "auth/refreshToken",
  // user
  USER_INFO = "user/info",
}

export default class Api {
  public static getUrl(path: ApiMapping): string {
    return `${process.env.REACT_APP_API_ROOT}${path}`;
  }
}