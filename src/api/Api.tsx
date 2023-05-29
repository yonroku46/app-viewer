export interface ApiResponse {
  errors: boolean,
  hasErrors: boolean,
  informations: [any],
  responseData: any,
  resultCode: number
}

export enum ApiMapping {
  // public
  API_CHECK = "/",
  // auth
  LOGIN = "/auth/login",
  LOGOUT = "/auth/logout",
  REFRESH_TOKEN = "/auth/refreshToken",
  // user
  USER_INFO = "/user/info",
}