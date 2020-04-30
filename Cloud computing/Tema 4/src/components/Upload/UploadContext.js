import React from 'react'
import {
	ADD_FILE_TO_LIST,
	READ_FILE,
	READ_FILE_FAIL,
	READ_FILE_SUCCESS,
	SEND_FILE,
	SEND_FILE_FAIL,
	SEND_FILE_SUCCESS,
	SET_DROP_DEPTH,
	SET_IN_DROP_ZONE, SPELL_CHECK
} from './UploadActions'

const initialState = {
	dropDepth: 0,
	inDropZone: false,
	fileList: [],
	url: undefined,
	text: undefined
}

const reducer = (state, action) => {
	switch (action.type) {
		case READ_FILE: {
			return {
				...state,
				loading: true,
				text: undefined
			}
		}
		case SEND_FILE: {
			return {
				...state,
				loading: true,
				text: undefined
			}
		}
		case SEND_FILE_FAIL: {
			return {
				...state,
				loading: false,
				text: undefined
			}
		}
		case SPELL_CHECK: {
			return {
				...state,
				spellCheck: action.payload
			}
		}
		case SET_DROP_DEPTH:
			return { ...state, dropDepth: action.dropDepth }
		case SET_IN_DROP_ZONE:
			return { ...state, inDropZone: action.inDropZone }
		case ADD_FILE_TO_LIST:
			return { ...state, fileList: state.fileList.concat(action.files) }
		case SEND_FILE_SUCCESS: {
			return { ...state,		loading: false,
				text: undefined, url: action.payload }
		}
		case READ_FILE_SUCCESS : {
			return {
				...state,
				text: action.payload,
				loading: false
			}
		}
		case READ_FILE_FAIL: {
			return {
				...state,
				loading: false
			}
		}
		default:
			return state
	}
}

const UploadContext = React.createContext()

function UploadContextProvider (props) {
	const [state, dispatch] = React.useReducer(reducer, initialState)
	return (
		<UploadContext.Provider value={{ state, dispatch }}>
			{props.children}
		</UploadContext.Provider>
	)
}

const UploadContextConsumer = UploadContext.Consumer

export { UploadContext, UploadContextProvider, UploadContextConsumer }
