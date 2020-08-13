import axios from 'axios';
import {returnErrors} from './errorActions';
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
  ADD_TO_CART_USER,
  ADD_TO_CART_FAIL,
  GET_CART_INFO_FAIL,
  GET_CART_INFO,
  CHANGE_PASSWORD_FAIL,
  CHANGE_PASSWORD,
  REMOVE_ONE_FROM_CART_FAIL,
  REMOVE_ONE_FROM_CART,
  REMOVE_FROM_CART_FAIL,
  REMOVE_FROM_CART,
  SUCCESS_BUY_FAIL,
  SUCCESS_BUY
} from './types';


// for get requests it is so easy 
// for post and put request i add some variables with the axios.post or axios.put request --> these values is the body 
//const history = useHistory();

export const loadUser = () => ( dispatch, getState) => {

dispatch({type:USER_LOADING});

axios
.get('/auth/user',tokenCheck())  
.then(res => 
	dispatch({
		type:USER_LOADED,
		payload:res.data
	})
    )
.catch(err => {
dispatch(returnErrors(err.response.data, err.response.status));
dispatch({
	type:AUTH_ERROR
});
});
};




export const register = ({name,email,password}) => (dispatch, getState) => { //note : ({name,email,password}) mo (name,email,password) y3nee jbton k object mnshan heek t7t 7awalton l json

const config = {                             //it always used when post a form,cuz in forms we use json/ and in the data base the data schema is a json
	headers: {
		"content-type":"application/json"
	}
}

const body = JSON.stringify({name,email,password}); // 7awalet l json .. l2n 2na fo2 3amel {}

axios.post('/users', body, config)  // note : hon 2na jebet al config mo al tokenconfig
.then(res => {
	dispatch({
		type: REGISTER_SUCCESS,
		payload:res.data
	})
})
.catch(err => { dispatch(returnErrors(err.response.data, err.response.status,'REGISTER_FAIL'));
	dispatch({
		type:REGISTER_FAIL
	});

	});

};

export const updateUser = ({name,lastname,email,images}) => (dispatch, getState) => { //note : ({name,email,password}) mo (name,email,password) y3nee jbton k object mnshan heek t7t 7awalton l json


const body = JSON.stringify({name,lastname,email,images}); // 7awalet l json .. l2n 2na fo2 3amel {}

axios.put('/users/updateUser', body, tokenConfig(getState))  // note : hon 2na jebet al config mo al tokenconfig
.then(res => {
	dispatch({
		type: UPDATE_USER,
		payload:res.data
	})
})
.catch(err => { dispatch(returnErrors(err.response.data, err.response.status,'UPDATE_USER_FAIL'));
	dispatch({
		type:UPDATE_USER_FAIL
	});

	});

};


export const changePassword = ({oldPassword,newPassword}) => (dispatch, getState) => {

	const body = JSON.stringify({oldPassword,newPassword});

	axios.put('/users/changePassword',body, tokenConfig(getState))
	.then(res => { dispatch({type:CHANGE_PASSWORD,payload:res.data}) 
	})
	.catch(err => {
		dispatch(returnErrors(err.response.data, err.response.status,'CHANGE_PASSWORD_FAIL'));
		dispatch({type:CHANGE_PASSWORD_FAIL});

	});
};


export const login = ({email,password}) => dispatch => {
	const config = {
		headers: {
			'content-type':'application/json'
		}
	};

	const body = JSON.stringify({email,password});

	axios.post('/auth',body, config)
	.then(res => { dispatch({type:LOGIN_SUCCESS,payload:res.data}) 
		//history.push('/');
	})
	.catch(err => {
		dispatch(returnErrors(err.response.data, err.response.status,'LOGIN_FAIL'));
		dispatch({type:LOGIN_FAIL});

	});
};





export const logout = () => {    // NOTE : hon ma 7a6eet dispatch l2n she3`le wa7de y3nee type wa7ed 3m 2b3to fb3mel return 3ady
	return {
		type: LOGOUT_SUCCESS
	};
	  
};


export const addToCart = (_id) => (dispatch,getState) => {


	axios.get(`/users/addToCart?productId=${_id}`,tokenConfig(getState))
	.then(res => { dispatch({type:ADD_TO_CART_USER,payload:res.data}) 
		//history.push('/');
	})
	.catch(err => {
		dispatch(returnErrors(err.response.data, err.response.status,'ADD_TO_CART_FAIL'));
		dispatch({type:ADD_TO_CART_FAIL});

	});
};

export const removeOneFromCart = (_id) => (dispatch,getState) => {


	axios.get(`/users/removeOneFromCart?productId=${_id}`,tokenConfig(getState))
	.then(res => { dispatch({type:REMOVE_ONE_FROM_CART,payload:res.data}) 
		//history.push('/');
	})
	.catch(err => {
		dispatch(returnErrors(err.response.data, err.response.status,'REMOVE_ONE_FROM_CART_FAIL'));
		dispatch({type:REMOVE_ONE_FROM_CART_FAIL});

	});
};

export const removeFromCart = (_id) => (dispatch,getState) => {


	axios.get(`/users/removeFromCart?productId=${_id}`,tokenConfig(getState))
	.then(res => { dispatch({type:REMOVE_FROM_CART,payload:res.data}) 
		//history.push('/');
	})
	.catch(err => {
		dispatch(returnErrors(err.response.data, err.response.status,'REMOVE_FROM_CART_FAIL'));
		dispatch({type:REMOVE_FROM_CART_FAIL});

	});
};







export const userCartInfo = () => (dispatch,getState) => {
	dispatch({type:USER_LOADING});
	axios.get('/users/userCartInfo',tokenConfig(getState))
	.then(res => { 
					   res.data.cart.forEach(cartItem => {
                res.data.cartDetail.forEach((cartDetail, i) => {
                    if (cartItem.id === cartDetail._id) {
                        res.data.cartDetail[i].quantity = cartItem.quantity;
                    }
                })
            })




		dispatch({type:GET_CART_INFO,payload:res.data}) 
	})
	.catch(err => {
		dispatch(returnErrors(err.response.data, err.response.status,'GET_CART_INFO_FAIL'));
		dispatch({type:GET_CART_INFO_FAIL});

	});
};

export const successBuy = (variables) => (dispatch,getState) => {
	axios.post('/users/successBuy',variables,tokenConfig(getState))
	.then(res => { 
				res.data.cart.forEach(cartItem => {
                res.data.cartDetail.forEach((cartDetail, i) => {
                    if (cartItem.id === cartDetail._id) {
                        res.data.cartDetail[i].quantity = cartItem.quantity;
                    }
                })
            })


		dispatch({type:SUCCESS_BUY,payload:res.data}) 
	})
	.catch(err => {
		dispatch(returnErrors(err.response.data, err.response.status,'SUCCESS_BUY_FAIL'));
		dispatch({type:SUCCESS_BUY_FAIL});

	});
};



export const tokenConfig = getState =>  {
	const token = getState().auth.token;

	const config = {
		headers:{
			'content-type':'application/json'
		}
	};


	if (token) {
		config.headers['x-auth-token'] = token;
	}

    return config;

};

export const tokenCheck = () =>  {
const token = localStorage.getItem('token');

if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
  	//delete axios.defaults.commons['x-auth-token'];
    console.log("fuck you");
  }
};








