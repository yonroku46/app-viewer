export type JSONData = {
  [key: string]: string | number | boolean | JSONData | Array<string | number | boolean | JSONData>;
}

export interface Response {
  errors: boolean,
  hasErrors: boolean,
  informations: [JSONData],
  responseData: JSONData,
  resultCode: Number
}

export interface ResponseData {
  [key: string]: string | number | boolean | JSONData | Array<string | number | boolean | JSONData>;
}

export enum Mapping {
  // auth
  CHECK = "auth/check",
  LOGIN = "auth/login",
  LOGOUT = "auth/logout",
  // user
  USER_INFO = "user/info",
}

export default class Api {
  public static getUrl(path: Mapping): string {
    return `${process.env.REACT_APP_API_ROOT}${path}`;
  }
}