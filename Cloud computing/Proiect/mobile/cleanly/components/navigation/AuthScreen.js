import React, { PureComponent } from 'react'
import { GoogleSigninButton } from '@react-native-community/google-signin'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { login } from '../LoginActions'

@connect(state => ({}), { login })
export default class AuthScreen extends PureComponent {
	render () {
		return (
			<View style={{flex: 1}}>
				<View style={{ flex: 0.5, justifyContent: 'center', backgroundColor: '#B92317' }}>
					<Text style={{color: '#fff', fontSize: 30, fontWeight: '900', alignSelf: 'center'}}>CLEANLY</Text>

				</View>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<GoogleSigninButton
						style={{ width: 192, height: 48, alignSelf: 'center' }}
						size={GoogleSigninButton.Size.Wide}
						color={GoogleSigninButton.Color.Dark}
						onPress={this.props.login}
					/>
				</View>
			</View>
		)
	}
}