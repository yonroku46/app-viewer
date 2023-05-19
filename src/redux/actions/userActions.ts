import { UserState, UserActionTypes, UserAction } from "./types/UserActionTypes";

export function userLogin(user: UserState): UserAction {
  return {
    type: UserActionTypes.USER_LOGIN,
    user: {
      uid: user.uid,
      userName: user.userName,
      mail: user.mail,
      token: user.token,
      refreshToken: user.refreshToken
    }
  };
}

export function userLogout(): UserAction {
  return {
    type: UserActionTypes.USER_LOGOUT,
  };
}