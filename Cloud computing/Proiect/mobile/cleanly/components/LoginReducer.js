import { GET_USER, GET_USER_FAIL, GET_USER_SUCCESS, LOGIN, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT } from './LoginActions'
import { AsyncStorage } from 'react-native'

const initialState = {
	access_token: undefined,
	refresh_token: undefined,
	expires_at: undefined,
	token_type: '',
	loggedIn: false,
	errorLogin: false,
	email: undefined,
	user: undefined
}

export default (state = initialState, action) => {
	switch (action.type) {
		case LOGOUT: {
			return {
				...state,
				user: undefined
			}
		}
		case LOGIN: {
			return {
				...state,
				loading: true
			}
		}
		case LOGIN_FAIL: {
			return {
				...state,
				loading: false
			}
		}
		case LOGIN_SUCCESS: {
			return {
				...state,
				user: action.payload.user,
				loading: false
			}
		}
		case GET_USER: {
			return {
				...state,
				loading: true
			}
		}
		case GET_USER_FAIL : {
			AsyncStorage.removeItem('cookie')
			return {
				...state,
				user: undefined
			}
		}
		case GET_USER_SUCCESS: {
			return {
				...state,
				user: action.payload.user,
				loading: false
			}
		}
		default:
			return state
	}
}
