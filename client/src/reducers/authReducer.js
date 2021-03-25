import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  ADD_TO_CART_FAIL,
  ADD_TO_CART_USER,
  GET_CART_INFO_FAIL,
  GET_CART_INFO,
  CHANGE_PASSWORD_FAIL,
  CHANGE_PASSWORD,
  REMOVE_ONE_FROM_CART_FAIL,
  REMOVE_ONE_FROM_CART,
  REMOVE_FROM_CART_FAIL,
  REMOVE_FROM_CART,
  SUCCESS_BUY_FAIL,
  SUCCESS_BUY,
} from "../actions/types"; 

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  cartInfo: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
      };
    case CHANGE_PASSWORD:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
      };
    case SUCCESS_BUY:
    case GET_CART_INFO:
      return {
        ...state,
        isLoading: false,
        cartInfo: action.payload,
      };
    case SUCCESS_BUY_FAIL:
    case REMOVE_FROM_CART_FAIL:
    case REMOVE_ONE_FROM_CART_FAIL:
    case CHANGE_PASSWORD_FAIL:
    case GET_CART_INFO_FAIL:
    case ADD_TO_CART_FAIL:
      return {
        ...state,
      };
    case REMOVE_FROM_CART:
    case ADD_TO_CART_USER:
      return {
        ...state,
        isLoading: false,
        user: {
          ...state.user,
          cart: action.payload,
        },
      };
    case REMOVE_ONE_FROM_CART:
      return {
        ...state,
        isLoading: false,
        user: {
          ...state.user,
          cart: action.payload,
        },
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isAuthenticated: true,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case UPDATE_USER_FAIL:
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}
