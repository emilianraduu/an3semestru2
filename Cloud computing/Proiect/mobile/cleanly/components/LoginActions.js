import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
import { AsyncStorage } from 'react-native'

export const LOGOUT = 'LOGOUT'
export const LOGIN = 'LOGIN'
export const LOGIN_FAIL = 'LOGIN_FAIL'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const GET_USER = 'GET_USER'
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS'
export const GET_USER_FAIL = 'GET_USER_FAIL'

export const logout = () => (dispatch) => {
	AsyncStorage.removeItem('cookie')
	dispatch({
		type: LOGOUT
	})
}
export const login = ({ email }) => async (dispatch) => {
	dispatch({
		type: LOGIN
	})
	try {
		await GoogleSignin.hasPlayServices()
		const userInfo = await GoogleSignin.signIn()
		await AsyncStorage.setItem('cookie', userInfo.idToken)
		dispatch({
			type: LOGIN_SUCCESS,
			payload: userInfo
		})
	} catch (error) {
		dispatch({
			type: LOGIN_FAIL
		})
		console.log(error)
		if (error.code === statusCodes.SIGN_IN_CANCELLED) {
			// user cancelled the login flow
		} else if (error.code === statusCodes.IN_PROGRESS) {
			// operation (e.g. sign in) is in progress already
		} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
			// play services not available or outdated
		} else {
			// some other error happened
		}
	}

}

export const getUser = () => async (dispatch) => {
	dispatch({
		type: GET_USER
	})

	const isSignedIn = await GoogleSignin.isSignedIn()
	const cookie = await AsyncStorage.getItem('cookie')
	if (isSignedIn && cookie) {
		try {
			const currentUser = await GoogleSignin.signInSilently()

			// const currentUser = await GoogleSignin.getCurrentUser()
			if (currentUser) {
				dispatch({
					type: GET_USER_SUCCESS,
					payload: currentUser
				})
			} else {
				dispatch({
					type: GET_USER_FAIL
				})
			}
		} catch (error) {
			if (error.code === statusCodes.SIGN_IN_REQUIRED) {
				// user has not signed in yet
			} else {
				// some other error
			}
		}
	} else {
		dispatch({
			type: GET_USER_FAIL
		})
	}

}