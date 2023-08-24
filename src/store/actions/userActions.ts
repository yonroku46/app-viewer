import { UserState, UserActionTypes, UserAction } from "../types/UserActionTypes";

export function userLogin(user: UserState): UserAction {
  return {
    type: UserActionTypes.USER_LOGIN,
    state: {
      userId: user.userId,
      userName: user.userName,
    }
  };
}

export function userLogout(): UserAction {
  return {
    type: UserActionTypes.USER_LOGOUT,
  };
}