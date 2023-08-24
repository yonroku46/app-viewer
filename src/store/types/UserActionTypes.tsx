export interface UserState {
    userId?: number;
    userName?: string;
    profileImg?: string;
    mail?: string;
    token?: string;
    refreshToken?: string;
    mailAuth?: boolean;
    role?: number;
}
  
export enum UserActionTypes {
    USER_LOGIN = "USER_LOGIN",
    USER_LOGOUT = "USER_LOGOUT",
}
  
interface UserLogin {
    type: UserActionTypes.USER_LOGIN;
    state: UserState;
}
  
interface UserLogout {
    type: UserActionTypes.USER_LOGOUT;
}
  
export type UserAction = UserLogin | UserLogout;