export interface ApiResponse {
  errors: boolean,
  hasErrors: boolean,
  informations: [any],
  responseData: any,
  resultCode: number
}

export module ApiMap {
  const root = process.env.REACT_APP_API_ROOT;

  // public
  export const HEALTH_CHECK = root + "/";

  // auth
  export const LOGIN = root + "/auth/login";
  export const LOGOUT = root + "/auth/logout";
  export const REFRESH_TOKEN = root + "/auth/refreshToken";
  
  // user
  export const USER_INFO = root + "/user/info";
}