import {
  GET_ITEMS,
  ADD_ITEM,
  DELETE_ITEM,
  ITEMS_LOADING,
  ADD_COMMENT,
  GET_ITEM,
  ADD_REPLY,
} from "../actions/types";

const initialState = {
  items: [],
  loading: false,
  product: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ITEMS:
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case GET_ITEM:
      return {
        ...state,
        product: action.payload,
        loading: false,
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      };
    case ADD_ITEM:
      return {
        ...state,
        items: [action.payload, ...state.items],
      };
    case ADD_COMMENT:
      return {
        ...state,
        product: action.payload,
      };
    case ADD_REPLY:
      return {
        ...state,
        product: action.payload,
        loading: false,
      };
    case ITEMS_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}

