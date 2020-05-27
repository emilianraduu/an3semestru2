import React, { useContext, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Cleared, IconOCR, TextWrapper } from '../../Global/Drop/DropWrapper'
import { TIMES_ICON } from '../../../styles/abstract/variables'
import { SecondaryButton } from '../../../styles/shared/button'
import { analyzeReadAPI, getSpellCheck, readAPI } from '../UploadActions'
import { UploadContext } from '../UploadContext'
import { Toast } from '../../Global/Toast'
import { Loader } from '../../Global/InfiniteScroll'

function OCR ({ setSelect, uploadFile, file, email, selectedFile }) {
	const uploadContext = useContext(UploadContext)
	const { text, url, loading, spellCheck } = uploadContext.state
	useEffect(() => {
			if (file) {
				const func = async () => {
					let response = await fetch(file.buffer)
					let data = await response.blob()
					let fl = new File([data], file.name)
					readAPI({ file: fl, uploadContext })
				}
				if (file.buffer) {
					func()
				} else {
					readAPI({ file: file, uploadContext })
				}
			}
		}, [file]
	)
	useEffect(() => {
		if (url) {
			analyzeReadAPI({ uploadContext, url })
		}
	}, [url])
	useEffect(() => {
		if (text) {
			let readedText = ''
			if (text && text.lines) {
				for (const line of text.lines) {
					readedText = readedText.concat('\n', line['text'])
				}
			}
			getSpellCheck({ text: readedText, uploadContext })
		}
	}, [text])
	let readedText = ''
	if (text && text.lines) {
		for (const line of text.lines) {
			readedText = readedText.concat('\n', line['text'])
		}
	}
	let cleanText = readedText
	if (spellCheck) {
		spellCheck.forEach(spell => {
			Object.keys(spell).map((key) => {
				if (cleanText.includes(key)) {
					cleanText = cleanText.replace(key, spell[key])
				}
			})
		})
	}

	let cleanedText = cleanText !== readedText
	let renderedText = cleanedText ? findDiff(cleanText, readedText) : readedText

	return (
		<TextWrapper>
			<div style={{ flex: 1, justifyContent: 'flex-end', display: 'flex', position: 'sticky', top: 0, left: 0 }}>
				<IconOCR onClick={() => setSelect()}><i className={TIMES_ICON} style={{ alignSelf: 'center' }}/></IconOCR>
			</div>
			<div style={{
				paddingBottom: 20,
				paddingTop: 20,
				position: 'relative',
				display: 'flex',
				height: '100%',
				width: '100%'
			}}>
				{
					loading &&
					<Loader/>
				}
				<div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', height: 'fit-content' }}>

					{
						(cleanedText) ?
							renderedText.map((text) => {
								let key = Object.keys(text).map(o => o.toString())
								if (text[key]) {
									return <Cleared hover={text[key]}> {key}</Cleared>

								} else {
									return <> {text} </>
								}

							})
							:
							renderedText
					}
				</div>
			</div>
			<div
				style={{ flex: 1, justifyContent: 'space-between', display: 'flex', position: 'sticky', bottom: 0, left: 0 }}>
				<SecondaryButton filled
												 onClick={() => {
													 uploadFile({
														 email, fileName: file.name, content: new Buffer(selectedFile
															 .replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64')
													 })
													 Toast({ errorMessage: '', message: 'Uploaded', error: false })

												 }
												 }
				>SAVE</SecondaryButton>
				<SecondaryButton filled onClick={() => setSelect()}>SHARE</SecondaryButton>
			</div>
		</TextWrapper>
	)
}

export default withRouter(OCR)

function findDiff (clean, dirty) {
	let diff = []
	let split1 = clean.split(/[\s,]+/)
	let split2 = dirty.split(/[\s,]+/)
	if (split1.length === split2.length) {
		for (let i = 0; i < split1.length; i++) {
			if (split1[i] !== split2[i]) {
				diff.push({
					[split1[i]]: split2[i]
				})
			}
			if (split1[i] === split2[i]) {
				diff.push(split1[i])
			}
		}
	}
	return diff
}