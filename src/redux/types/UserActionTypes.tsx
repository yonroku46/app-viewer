export interface UserState {
    uid?: number;
    userName?: string;
    mail?: string;
    token?: string;
    refreshToken?: string;
}
  
export enum UserActionTypes {
    USER_LOGIN = "USER_LOGIN",
    USER_LOGOUT = "USER_LOGOUT",
}
  
interface UserLogin {
    type: UserActionTypes.USER_LOGIN;
    user: UserState;
}
  
interface UserLogout {
    type: UserActionTypes.USER_LOGOUT;
}
  
export type UserAction = UserLogin | UserLogout;