import React, { PureComponent } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from './Home'
import { OpenSideMenu } from './OpenSideMenu'

const Drawer = createDrawerNavigator()

export default class MainNavigator extends PureComponent {
	render () {
		return (
			<Drawer.Navigator drawerContent={(props) => <OpenSideMenu {...props}  />}>
				<Drawer.Screen name="Home" component={Home} options={{title: 'Home'}}/>
			</Drawer.Navigator>
		)

	}
}