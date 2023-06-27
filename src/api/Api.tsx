export interface ApiResponse {
  errors: boolean,
  hasErrors: boolean,
  informations: [any],
  responseData: any,
  resultCode: number
}

export module ApiRoutes {
  const root = process.env.REACT_APP_API_ROOT;

  // public
  export const HEALTH_CHECK = `${root}/`;

  // auth
  const authRoot = `${root}/auth`;
  export const LOGIN = `${authRoot}/login`;
  export const LOGOUT = `${authRoot}/logout`;
  export const SUBMIT = `${authRoot}/submit`;
  export const KEY_CHECK = `${authRoot}/check`;
  export const REFRESH_TOKEN = `${authRoot}/refreshToken`;
  
  // user
  const userRoot = `${root}/user`;
  export const USER_INFO = `${userRoot}/info`;
}