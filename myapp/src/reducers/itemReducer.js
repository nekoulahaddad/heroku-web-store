import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING,ADD_COMMENT,GET_ITEM,ADD_REPLY } from '../actions/types';

const initialState = {
items: [],
loading: false,
product:{}
}


export default function(state = initialState, action) {
switch (action.type) {
case GET_ITEMS:
return {
...state,
items:action.payload,
loading:false
};
case GET_ITEM:
return {
...state,
product:action.payload,
loading:false
};
case DELETE_ITEM:
return {
...state,
items:state.items.filter(item => item._id !== action.payload)
};
case ADD_ITEM:
return {
	...state,
	items: [action.payload,...state.items]
};
case ADD_COMMENT:
return {
	...state,
	product: action.payload
};
case ADD_REPLY:
return {
...state,
product:action.payload,
loading:false
};
case ITEMS_LOADING:
return{
	...state,
	loading:true
};
default :
return state;
}
}



/*

images:[{0:"5f20a43d6ddd2b11d05e0a28"}],
likes:1,
comment_count:1,
sold:1,
views:1,
_id:"5f20a43d6ddd2b11d05e0a28",
name:"sdsd",
price:1,
price_sale:1,
date: "2020-07-28T23:40:43.194Z",
category:"Electronics",
description:"Electronics",
comment:[{_id:"5f20b262a782e404c4ada45e"}],
replies:[{_id:"5f20b262a782e404c4ada45e"}]

*/