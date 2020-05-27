import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import LoginReducer from './LoginReducer'
import UploadReducer from './UploadReducer'

const appReducer = combineReducers({
	form: formReducer,
	login: LoginReducer,
	upload: UploadReducer
})
const rootReducer = (state, action) => {
	return appReducer(state, action)
}

export default rootReducer
