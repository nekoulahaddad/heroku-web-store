import {createStore, applyMiddleware} from "redux"; // createStore used to create a store ... applyMiddleware (to use a middle ware {like redux-thunk}) .. compose used to use many things like { apply middle ware and another tools from the redux-devtools }
import thunk from  "redux-thunk";
import rootReducer from "./reducers/rootReducer"

import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {};

const middleware = [thunk];

const store = createStore(rootReducer, initialState, composeWithDevTools(
applyMiddleware(...middleware)//,
//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // thats for using redux dev tools in the inspect (console in google chrome)
	))

export default store;