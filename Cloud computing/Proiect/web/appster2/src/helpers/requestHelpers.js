import axios from 'axios'

export const makeAuthRequest = (data, tries = 0, newTokenData) => async (authContext, showAlert = false) => {
	let { accessToken } = authContext.state
	data.headers = { Authorization: `Bearer ${accessToken}` }
	return await axios(data)
}
