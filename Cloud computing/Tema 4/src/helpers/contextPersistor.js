const statePersister = (STORAGE_KEY = 'key', initialState = {}) => {
	let state = localStorage.getItem(STORAGE_KEY)
	if (state) {
		state = JSON.parse(state)
		state.errorLogin = false
	} else {
		state = initialState
	}
	return state
}
const reducerPersistor = (STORAGE_KEY, reducer) => (state, action) => {
	const newState = reducer(state, action)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
	return newState
}
export { reducerPersistor, statePersister }