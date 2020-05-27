import { applyMiddleware, createStore } from 'redux'
import { persistStore } from 'redux-persist'
import ReduxThunk from 'redux-thunk'
import rootReducer from './rootReducer'

const middleware = ReduxThunk

export default () => {
	let store = createStore(rootReducer, undefined, applyMiddleware(middleware))
	let persistor = persistStore(store)
	return { persistor, store }
}
