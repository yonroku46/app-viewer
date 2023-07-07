import { UserState, UserAction, UserActionTypes } from "../types/UserActionTypes";

const initialState: UserState = {
  userId: undefined,
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
      return { ...state, userId: action.user.userId, userName: action.user.userName, mail: action.user.mail, token: action.user.token, refreshToken: action.user.refreshToken, mailAuth: action.user.mailAuth };
    case UserActionTypes.USER_LOGOUT:
      return { ...state, userId: undefined, userName: undefined, mail: undefined, token: undefined, refreshToken: undefined, mailAuth: undefined };
    default:
      return state;
  }
}