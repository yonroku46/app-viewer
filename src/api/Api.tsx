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

  // oauth2
  const oauth2Root = `${root}/oauth2/login`;
  export const GOOGLE_ACCESS_TOKEN = `${oauth2Root}/google/access-token`;
  export const LINE_ACCESS_TOKEN = `${oauth2Root}/line/access-token`;

  // auth
  const authRoot = `${root}/auth`;
  export const LOGIN = `${authRoot}/login`;
  export const LOGOUT = `${authRoot}/logout`;
  export const SUBMIT = `${authRoot}/submit`;
  export const RECOVER = `${authRoot}/recover`;
  export const KEY_CHECK = `${authRoot}/check`;
  export const REFRESH_TOKEN = `${authRoot}/refresh-token`;
  
  // user
  const userRoot = `${root}/user`;
  export const USER_INFO = `${userRoot}/info`;
  
  // product
  const productRoot = `${root}/product`;
  export const PRODUCT_INFO = `${productRoot}/info`;
  export const PRODUCT_FILTER = `${productRoot}/filter`;
  export const PRODUCT_HISTORY = `${productRoot}/history`;
  export const PRODUCT_LIKED = `${productRoot}/like`;

  // social
  const socialRoot = `${root}/social`;
  export const SOCIAL_INFO = `${socialRoot}/info`;
  export const SOCIAL_FILTER = `${socialRoot}/filter`;
  export const SOCIAL_HISTORY = `${socialRoot}/history`;
  export const SOCIAL_LIKE = `${socialRoot}/like`;
  export const SOCIAL_COMMENT = `${socialRoot}/comment`;
}