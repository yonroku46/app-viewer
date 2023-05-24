import { combineReducers } from "redux";
import popupReducer from "./popupReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  popup: popupReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;