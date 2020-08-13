import {combineReducers} from "redux";
import itemReducer from "./itemReducer";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";


export default combineReducers({
	item : itemReducer, // item is the name that i will use it when i will use this reducer
	auth : authReducer,
	error : errorReducer
})