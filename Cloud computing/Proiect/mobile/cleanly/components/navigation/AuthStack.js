import { createStackNavigator } from '@react-navigation/stack'
import React, { PureComponent } from 'react'
import App from '../../App'
import AuthScreen from './AuthScreen'

const Stack = createStackNavigator()

export default class AuthStack extends PureComponent {
	render () {
		return (
			<Stack.Navigator initialRouteName={'Home'} screenOptions={{headerShown: false}}>
				<Stack.Screen name="Home" component={AuthScreen}/>
			</Stack.Navigator>
		)
	}
}