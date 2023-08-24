import { combineReducers } from "redux";
import loadingReducer from "./loadingReducer";
import popupReducer from "./popupReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  loading: loadingReducer,
  popup: popupReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;