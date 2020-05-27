import { OCR_API, OCR_KEY } from './constants'

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

export const handleDragEnter = ({ data }) => dispatch => {
	dispatch({
		type: SET_DROP_DEPTH,
		dropDepth: data.dropDepth + 1
	})
}
export const handleDragOver = ({ e }) => dispatch => {
	e.dataTransfer.dropEffect = 'copy'
	dispatch({
		type: SET_IN_DROP_ZONE,
		inDropZone: true
	})
}

export const handleDragLeave = ({ data }) => (dispatch) => {
	dispatch({
		type: SET_DROP_DEPTH,
		dropDepth: data.dropDepth - 1
	})
	if (data.dropDepth > 0) return
	dispatch({
		type: SET_IN_DROP_ZONE,
		inDropZone: false
	})
}

export const addFilesToList = ({ files }) => dispatch => {
	dispatch({ type: ADD_FILE_TO_LIST, files })
}
/**
 * @api {post} /OCR_API Send photo for analysing
 * @apiName OCR_API
 * @apiGroup OCR
 *
 * @apiParam {file} File the image file from where the OCR API analyses text
 *
 * @apiSuccess {string} url Callback URL to check if OCR API has finished analysing.
 */
export const readAPI = ({ file }) => async (dispatch) => {

	dispatch({
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

			dispatch({
				type: SEND_FILE_SUCCESS,
				payload: url
			})
		} else {

			dispatch({
				type: SEND_FILE_FAIL
			})
		}
	} catch
		(error) {
		dispatch({
			type: SEND_FILE_FAIL
		})
	}
}

export const analyzeReadAPI = ({ url, id = false }) => async (dispatch) => {
	dispatch({
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

			dispatch({
				type: READ_FILE_SUCCESS,
				payload: body.recognitionResults[0]
			})
			if (id) {
				clearInterval(ID_TIMEOUT)

			}
		} else {
			if (body.status === 'Running' && !id) {
				ID_TIMEOUT = setInterval(() => analyzeReadAPI({ url, id: true })(dispatch), 1000)
			} else {
				console.log('aici')
				clearInterval(ID_TIMEOUT)
				dispatch({
					type: READ_FILE_FAIL
				})
			}

		}

	} catch (error) {
		console.log(error)
		clearInterval(ID_TIMEOUT)
		dispatch({
			type: READ_FILE_FAIL
		})
	}
}

export const getSpellCheck =  ({ text }) => async (dispatch) =>{
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

			dispatch({
				type: SPELL_CHECK,
				payload: spellCheckArray
			})
		}
	} catch (err) {
		console.log(err)
	}

}