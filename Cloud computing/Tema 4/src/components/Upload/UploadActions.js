import { OCR_API, OCR_KEY } from '../../config/constants'
export const SET_DROP_DEPTH = 'SET_DROP_DEPTH'
export const SET_IN_DROP_ZONE = 'SET_IN_DROP_ZONE'
export const ADD_FILE_TO_LIST = 'ADD_FILE_TO_LIST'
export const SEND_FILE = 'SEND_FILE'
export const SEND_FILE_SUCCESS = 'SEND_FILE_SUCCESS'
export const SEND_FILE_FAIL = 'SEND_FILE_FAIL'
export const READ_FILE_SUCCESS = 'READ_FILE_SUCCESS'
export const READ_FILE_FAIL = 'READ_FILE_FAIL'
export const READ_FILE = 'READ_FILE'
export const SPELL_CHECK = 'SPELL_CHECK'

let ID_TIMEOUT = undefined

export const handleDragEnter = ({ uploadContext, data }) => () => {
	uploadContext.dispatch({
		type: SET_DROP_DEPTH,
		dropDepth: data.dropDepth + 1
	})
}
export const handleDragOver = ({ uploadContext, e }) => () => {
	e.dataTransfer.dropEffect = 'copy'
	uploadContext.dispatch({
		type: SET_IN_DROP_ZONE,
		inDropZone: true
	})
}

export const handleDragLeave = ({ uploadContext, data }) => {
	uploadContext.dispatch({
		type: SET_DROP_DEPTH,
		dropDepth: data.dropDepth - 1
	})
	if (data.dropDepth > 0) return
	uploadContext.dispatch({
		type: SET_IN_DROP_ZONE,
		inDropZone: false
	})
}

export const addFilesToList = ({ uploadContext, files }) => {
	uploadContext.dispatch({ type: ADD_FILE_TO_LIST, files })
}

export const readAPI = async ({ file, uploadContext }) => {
	uploadContext.dispatch({
		type: SEND_FILE
	})
	try {
		const resp = await fetch(OCR_API,
			{
				method: 'POST',
				body: file,
				headers: {
					'Content-Type': 'application/octet-stream',
					'Ocp-Apim-Subscription-Key': OCR_KEY
				}
			})
		let url
		resp.headers.forEach((e) => {
			if (e.includes('https://')) {
				url = e
			}
		})
		if (url) {
			uploadContext.dispatch({
				type: SEND_FILE_SUCCESS,
				payload: url
			})
		} else {
			uploadContext.dispatch({
				type: SEND_FILE_FAIL
			})
		}
	} catch
		(error) {
		uploadContext.dispatch({
			type: SEND_FILE_FAIL
		})
	}
}

export const analyzeReadAPI = async ({ url, uploadContext, id = false }) => {
	uploadContext.dispatch({
		type: READ_FILE
	})
	try {
		const response = await fetch(url,
			{
				headers: {
					'Ocp-Apim-Subscription-Key': OCR_KEY
				}
			})
		let body = await response.json()
		if (body && body.recognitionResults) {
			uploadContext.dispatch({
				type: READ_FILE_SUCCESS,
				payload: body.recognitionResults[0]
			})
			if (id) {
				clearInterval(ID_TIMEOUT)

			}
		} else {
			if (body.status === 'Running' && !id) {
				ID_TIMEOUT = setInterval(() => analyzeReadAPI({ url, uploadContext, id: true }), 1000)
			} else {
				clearInterval(ID_TIMEOUT)
				uploadContext.dispatch({
					type: READ_FILE_FAIL
				})
			}

		}

	} catch (error) {
		clearInterval(ID_TIMEOUT)
		uploadContext.dispatch({
			type: READ_FILE_FAIL
		})
	}
}

export const getSpellCheck = async ({ text, uploadContext }) => {
	let path = '/bing/v7.0/spellcheck'
	let key = 'd28c1a6766d54bdcb6724ea066a10152'
	let mkt = 'en-US'
	let mode = 'proof'
	let query_string = '?mkt=' + mkt + '&mode=' + mode
	text = 'text=' + text
	let url = 'https://westeurope.api.cognitive.microsoft.com/' + path + query_string

	try {
		const resp = await fetch(url, {
			body: text,
			method: 'POST',

			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': text.length,
				'Ocp-Apim-Subscription-Key': key
			}
		})
		const response = await resp.json()
		let spellCheckArray = []
		if (response) {
			response.flaggedTokens.map((f) => {
				spellCheckArray.push({ [f.token]: f.suggestions[0].suggestion })
			})
		}
		if (spellCheckArray.length > 0) {
			uploadContext.dispatch({
				type: SPELL_CHECK,
				payload: spellCheckArray
			})
		}
	} catch (err) {
		console.log(err)
	}

}