import { combineReducers } from "redux";
import customizer from "./customizer/";
import auth from "./auth/";

const rootReducer = combineReducers({
  customizer: customizer,
  auth: auth,
});

export default rootReducer;
