import React from 'react'
import { LOGIN, LOGOUT } from './AuthActions'
import { reducerPersistor, statePersister } from '../../helpers/contextPersistor'


const STORAGE_KEY = 'auth'
const initialState = {
	access_token: undefined,
	refresh_token: undefined,
	expires_at: undefined,
	token_type: '',
	loggedIn: false,
	errorLogin: false,
	email: undefined
}

const reducer = (state, action) => {
	switch (action.type) {
		case LOGOUT: {
			return {
				...state,
				loggedIn: false
			}
		}
		case LOGIN: {
			return {
				...state,
				loggedIn: true,
				email: action.payload
			}
		}
		default:
			return state
	}
}
const AuthContext = React.createContext()

function AuthContextProvider (props) {
	const [state, dispatch] = React.useReducer(reducerPersistor(STORAGE_KEY, reducer), statePersister(STORAGE_KEY, initialState))
	return (
		<AuthContext.Provider value={{ state, dispatch }}>
			{props.children}
		</AuthContext.Provider>
	)
}

const AuthContextConsumer = AuthContext.Consumer

export { AuthContext, AuthContextProvider, AuthContextConsumer }
