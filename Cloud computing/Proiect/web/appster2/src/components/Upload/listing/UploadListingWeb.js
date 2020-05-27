import React, { useContext, useEffect, useState } from 'react'
import { PageContent } from '../../../styles/shared/wrapper'
import DragAndDrop from './DragAndDrop'
import { withRouter } from 'react-router-dom'
import OCR from './OCR'
import { serviceClient } from '../../../config/constants'
import { AuthContext } from '../../Auth/AuthContext'
import { UploadContext } from '../UploadContext'
import { addFilesToList } from '../UploadActions'

function UploadListingWeb () {
	const [selectedFile, setSelect] = useState()
	const [file, setFile] = useState()
	const authContext = useContext(AuthContext)
	const uploadContext = useContext(UploadContext)
	const { email } = authContext.state
	useEffect(() => {
		getFiles({ email, uploadContext })
	}, [])
	return (
		<PageContent type='web' flex>
			<div style={{ flex: selectedFile !== undefined ? 1 : 'initial', display: 'flex', transition: '0.5s ease all' }}>
				{
					selectedFile &&
					<OCR setSelect={setSelect} selectedFile={selectedFile} file={file} uploadFile={uploadFile} email={email}/>
				}
			</div>
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column', transition: '0.5s ease all' }}>
				<DragAndDrop setSelect={setSelect} selectedFile={selectedFile} setFile={setFile}/>
			</div>
		</PageContent>
	)
}

export default withRouter(UploadListingWeb)

async function checkIfDirectoryExists (dirName) {
	const shareName = 'newfileshare'
	const directoryClient = serviceClient.getShareClient(shareName).rootDirectoryClient
	try {
		let dirIter = directoryClient.listFilesAndDirectories()
		for await (const item of dirIter) {
			if (item.name === dirName) {
				return true
			}
		}
		return false

	} catch (e) {
		return false
	}
}

async function createDirectory (email) {
	const shareName = 'newfileshare'
	const directoryName = email
	const directoryClient = serviceClient.getShareClient(shareName).getDirectoryClient(directoryName)
	await directoryClient.create()
}


/**
 * @api {post} /serviceClient/ File Storage Solution
 * @apiName File Storage
 * @apiGroup File Storage
 */
async function uploadFile ({ email, fileName, content }) {
	const shareName = 'newfileshare'
	const check = await checkIfDirectoryExists(email)
	if (!check) {
		await createDirectory(email)
	}
	const directoryClient = serviceClient.getShareClient(shareName).getDirectoryClient(email)

	const fileClient = directoryClient.getFileClient(fileName)
	await fileClient.create(content.length)

	// Upload file range
	await fileClient.uploadRange(content, 0, content.length)
	alert('uploaded')
}

async function getFileBuffer (email, fileName) {
	const shareName = 'newfileshare'
	const fileClient = serviceClient
		.getShareClient(shareName)
		.getDirectoryClient(email).getFileClient(fileName)

	// console.log(fileClient)
	// let resp = await fileClient.downloadToBuffer(undefined, 0, undefined, {
	// 	abortSignal: AbortController.timeout(30 * 60 * 1000),
	// 	onProgress: (ev) => console.log(ev)
	// })
	return fileClient.url
}

async function getFiles ({ email, uploadContext }) {
	const shareName = 'newfileshare'
	const directoryName = email
	const check = await checkIfDirectoryExists(email)
	if (!check) {
		createDirectory(email)

	}
	const directoryClient = serviceClient.getShareClient(shareName).getDirectoryClient(directoryName)

	let dirIter = directoryClient.listFilesAndDirectories()

	let files = []
	for await (const item of dirIter) {
		let buffer = await getFileBuffer(email, item.name)
		let file = { name: item.name, buffer: buffer }
		files.push(file)

	}
	addFilesToList({ files, uploadContext })
}