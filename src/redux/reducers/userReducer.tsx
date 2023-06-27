import { UserState, UserAction, UserActionTypes } from "../types/UserActionTypes";

const initialState: UserState = {
  uid: undefined,
  userName: undefined,
  mail: undefined,
  token: undefined,
  refreshToken: undefined,
  mailAuth: undefined
}

export default function userReducer(
  state = initialState,
  action: UserAction
): UserState {
  switch (action.type) {
    case UserActionTypes.USER_LOGIN:
      return { ...state, uid: action.user.uid, userName: action.user.userName, mail: action.user.mail, token: action.user.token, refreshToken: action.user.refreshToken, mailAuth: action.user.mailAuth };
    case UserActionTypes.USER_LOGOUT:
      return { ...state, uid: undefined, userName: undefined, mail: undefined, token: undefined, refreshToken: undefined, mailAuth: undefined };
    default:
      return state;
  }
}