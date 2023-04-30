import { combineReducers } from "redux";
import popupReducer from "./popupReducer";

const rootReducer = combineReducers({
  popup: popupReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;