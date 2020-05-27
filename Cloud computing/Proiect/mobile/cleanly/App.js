import React, { useEffect, useState } from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { GoogleSignin } from '@react-native-community/google-signin'
import AppNavigator from './components/navigation/AppNavigator'
import { AsyncStorage, StatusBar, View } from 'react-native'
import configureStore from './components/configureStore'
import { Provider } from 'react-redux'
import { MyStatusBar } from './components/OpenSideMenu'

GoogleSignin.configure({
	webClientId: '57585960825-01he9k9167if16vusi7ma3saf5937d72.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
	offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
	iosClientId: '57585960825-d1htbk489cj6ke570ikf63hrk34lraae.apps.googleusercontent.com' // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
})
const { store } = configureStore()
export default function App () {
	const [cookie, setCookie] = useState(false)
	const [boolCookie, resetCookie] = useState(false)
	useEffect(() => {
		if (boolCookie) {
			getCookie().then((r) => setCookie(r))
			resetCookie(false)
		}
	}, [boolCookie])

	useEffect(() => {
		getCookie().then((r) => setCookie(r))
	}, [])
	if (cookie === false) {
		return <></>
	}
	return (
		<NavigationContainer>
			<Provider store={store}>
				<MyStatusBar backgroundColor={'#B92317'} barStyle="light-content"/>
				<AppNavigator cookie={cookie} resetCookie={resetCookie}/>
			</Provider>
		</NavigationContainer>
	)
}

async function getCookie () {
	return await AsyncStorage.getItem('cookie')
}