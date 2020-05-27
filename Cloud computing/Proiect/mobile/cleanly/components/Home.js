import React, { PureComponent } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import PhotoUpload from './PhotoUpload'
import ImageModal from './ImageModal'

export default class Home extends PureComponent {
	state = {
		showModal: false,
		images: []
	}

	addImage = (img) => {
		this.setState({ images: [...this.state.images, img] })
	}

	render () {
		const { navigation } = this.props
		const { showModal, images } = this.state
		return (
			<View style={{ padding: 10, flex: 1 }}>
				<View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity
							activeOpacity={0.6}
							style={{ width: 50, alignSelf: 'flex-start' }}
							onPress={() => navigation.openDrawer()}>
							<MaterialCommunityIcons name={'menu'} size={28} color={'black'}/>
						</TouchableOpacity>
						<Text style={{ fontSize: 25, fontWeight: '900' }}>Home</Text>
					</View>
					<PhotoUpload addImage={this.addImage}/>

				</View>

				<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
					{images.map(
						image => <>

							<TouchableOpacity onPress={()=>this.setState({showModal: !showModal, image: image})}><Image source={{ uri: image }}
																			 style={{ width: '100%', height: 300, marginTop: 10, borderRadius: 10 }}/>
							</TouchableOpacity>
						</>
					)}
					<ImageModal image={this.state.image} showModal={showModal} closeModal={()=>this.setState({showModal: false})}/>

				</ScrollView>
			</View>
		)

	}
}