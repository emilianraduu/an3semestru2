import React, { PureComponent } from 'react'
import Modal from 'react-native-modal'
import { Clipboard, Text, TouchableOpacity, View } from 'react-native'
import { analyzeReadAPI, getSpellCheck, readAPI } from './UploadActions'
import { connect } from 'react-redux'
import RNFS from 'react-native-fs'
import B64A from 'base64-arraybuffer'

@connect(state => ({
	url: state.upload.url,
	text: state.upload.text,
	loading: state.upload.loading,
	spellCheck: state.upload.spellCheck
}), {
	readAPI,
	analyzeReadAPI,
	getSpellCheck
})
export default class ImageModal extends PureComponent {
	state = {
		needsRefresh: false,
		tab: 0
	}

	componentDidUpdate (prevProps, prevState, snapshot) {
		if (this.props.showModal && !prevProps.showModal) {
			if (this.props.image && prevProps.image && this.props.image !== prevProps.image) {
				this.setState({ needsRefresh: true })
			}
			if (this.props.image && !prevProps.image) {
				this.setState({ needsRefresh: true })
			}
		}
		if (!this.props.showModal && prevProps.showModal) {
			this.setState({ needsRefresh: false })
		}

		if (this.state.needsRefresh && !prevState.needsRefresh) {
			RNFS.readFile(this.props.image, 'base64').then(data => {
				this.props.readAPI({ file: B64A.decode(data) })
			})
		}
		if (this.props.url !== prevProps.url && this.state.needsRefresh) {
			this.setState({ needsRefresh: false })
			this.props.analyzeReadAPI({ url: this.props.url })
		}

		if (this.props.text && !prevProps.text) {
			let readedText = ''
			if (this.props.text && this.props.text.lines) {
				for (const line of this.props.text.lines) {
					readedText = readedText.concat('\n', line['text'])
				}
			}
			this.props.getSpellCheck({ text: readedText })
		}
		// if (this.props.showModal && !this.state.urlRequest) {
		//
		// 	this.setState({ urlRequest: true })

		// }
		// if (this.props.url && !this.state.urlRead) {
		// 	this.setState({ urlRead: true })
		// }
		// if (!this.props.showModal && prevProps.showModal) {
		// 	this.setState({ urlRequest: false, urlRead: false })
		// }
		// if(this.props.image !== prevProps.image && (prevProps.image && this.props.image)){
		// 	this.setState({ urlRequest: false, urlRead: false })
		// 	RNFS.readFile(this.props.image, 'base64').then(data => {
		// 		this.props.readAPI({ file: B64A.decode(data) })
		// 	})
		// }
	}

	render () {
		const { showModal, text, loading, spellCheck } = this.props

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
		return (
			<Modal isVisible={showModal}
						 supportedOrientations={['portrait']}
						 style={{
							 width: '100%',
							 flex: 1,
							 margin: 0,
							 paddingTop: 100
						 }}
						 transparent={true}
						 backdropTransitionOutTiming={0}
						 hideModalContentWhileAnimating={true}
						 useNativeDriver={false}
						 onBackdropPress={this.props.closeModal}
			>
				<View style={{ backgroundColor: '#fff', width: '100%', flex: 1, padding: 10 }}>
					<View style={{
						width: '100%',
						height: 40,
						backgroundColor: '#D3d3d3',
						flexDirection: 'row',
						borderRadius: 5,
						justifyContent: 'space-between',
						overflow: 'hidden'
					}}>
						<TouchableOpacity style={{
							justifyContent: 'center',
							flex: 1,
							backgroundColor: this.state.tab === 0 ? '#B92317' : '#d3d3d3'
						}} onPress={() => this.setState({ tab: 0 })}>
							<Text style={{ alignSelf: 'center', color: this.state.tab === 0 ? '#fff' : '#000' }}>
								CORRECTED
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{
							justifyContent: 'center',
							flex: 1,
							backgroundColor: this.state.tab === 1 ? '#B92317' : '#d3d3d3'
						}} onPress={() => this.setState({ tab: 1 })}>
							<Text style={{ alignSelf: 'center', color: this.state.tab === 1 ? '#fff' : '#000' }}>
								ORIGINAL
							</Text>

						</TouchableOpacity>
					</View>
					{
						loading && <Text>Loading..</Text>
					}
					{
						this.state.tab === 0 ?
							<TouchableOpacity onPress={() => {
								Clipboard.setString(cleanText)
								alert('Text has been copied')
							}}>
								<Text>{cleanText}</Text>
							</TouchableOpacity>
							:
							<Text>{readedText}</Text>
					}

				</View>
			</Modal>
		)
	}
}
