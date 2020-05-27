export const LOGOUT = 'LOGOUT'
export const LOGIN = 'LOGIN'

export const logout = ({authContext})=>{
		authContext.dispatch({
			type: LOGOUT
		})
}
export const login = ({authContext, email})=>{
	authContext.dispatch({
		type: LOGIN,
		payload: email
	})
}