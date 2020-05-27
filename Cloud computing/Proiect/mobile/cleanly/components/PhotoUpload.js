import * as React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import { MaterialIcons } from '@expo/vector-icons'

export default class PhotoUpload extends React.Component {

	render () {

		return (
				<TouchableOpacity style={{
					alignSelf: 'center',
					justifyContent: 'flex-end',
					flexDirection: 'row'
				}} onPress={this._pickImage}>
					<MaterialIcons name={'add'} color={'black'} size={30}
												 style={{ alignSelf: 'center', marginRight: 5, marginLeft: -20 }}/>
				</TouchableOpacity>

		)
	}

	componentDidMount () {
		this.getPermissionAsync()
	}

	getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!')
			}
		}
	}

	_pickImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1
			})
			if (!result.cancelled) {
				this.props.addImage(result.uri, result.name)
			}

		} catch (E) {
			console.log(E)
		}
	}
}
//
// async function checkIfDirectoryExists (dirName) {
// 	const shareName = 'newfileshare'
// 	const directoryClient = serviceClient.getShareClient(shareName).rootDirectoryClient
// 	try {
// 		let dirIter = directoryClient.listFilesAndDirectories()
// 		for await (const item of dirIter) {
// 			if (item.name === dirName) {
// 				return true
// 			}
// 		}
// 		return false
//
// 	} catch (e) {
// 		return false
// 	}
// }
//
// async function createDirectory (email) {
// 	const shareName = 'newfileshare'
// 	const directoryClient = serviceClient.getShareClient(shareName).getDirectoryClient(email)
// 	await directoryClient.create()
// }
//
// async function uploadFile ({ email, fileName, content }) {
// 	console.log('here')
// 	const shareName = 'newfileshare'
// 	const check = await checkIfDirectoryExists(email)
// 	if (!check) {
// 		await createDirectory(email)
// 	}
// 	const directoryClient = serviceClient.getShareClient(shareName).getDirectoryClient(email)
//
// 	const fileClient = directoryClient.getFileClient(fileName)
// 	await fileClient.create(content.length)
//
// 	// Upload file range
// 	await fileClient.uploadRange(content, 0, content.length)
// 	alert('uploaded')
// }
//
// async function getFileBuffer (email, fileName) {
// 	const shareName = 'newfileshare'
// 	const fileClient = serviceClient
// 		.getShareClient(shareName)
// 		.getDirectoryClient(email).getFileClient(fileName)
//
// 	// console.log(fileClient)
// 	// let resp = await fileClient.downloadToBuffer(undefined, 0, undefined, {
// 	// 	abortSignal: AbortController.timeout(30 * 60 * 1000),
// 	// 	onProgress: (ev) => console.log(ev)
// 	// })
// 	return fileClient.url
// }
//
// async function getFiles ({ email, uploadContext }) {
// 	const shareName = 'newfileshare'
// 	const directoryName = email
// 	const check = await checkIfDirectoryExists(email)
// 	if (!check) {
// 		createDirectory(email)
//
// 	}
// 	const directoryClient = serviceClient.getShareClient(shareName).getDirectoryClient(directoryName)
//
// 	let dirIter = directoryClient.listFilesAndDirectories()
//
// 	let files = []
// 	for await (const item of dirIter) {
// 		let buffer = await getFileBuffer(email, item.name)
// 		let file = { name: item.name, buffer: buffer }
// 		files.push(file)
//
// 	}
// 	addFilesToList({ files, uploadContext })
// }