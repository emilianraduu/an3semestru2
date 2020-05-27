import React, { PureComponent } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import TouchableItem from 'react-native-tab-view/src/TouchableItem'
import { logout } from './LoginActions'
import FastImage from 'react-native-fast-image'

const EXCLUDED_ITEMS = []
const AUTH_ITEMS = []

@connect((state) => ({
	user: state.login.user
}), { logout })
export class OpenSideMenu extends PureComponent {
	render () {
		const { state, navigation, descriptors, logout } = this.props
		const { routes: items } = state
		const { user } = this.props
		const filteredItems = {
			...state,
			routes: items,
			index: state.index - 1
		}
		return (
			<>
				<MyStatusBar backgroundColor={'#B92317'} barStyle="light-content"/>
				<SafeAreaView style={{
					flex: 1,
					width: '100%'
				}}>
					<View style={{
						flex: 1,
						width: '100%',
						zIndex: 15
					}}>
						<View style={{
							width: '100%',
							height: 160,
							backgroundColor: '#B92317',
							flexDirection: 'column',
							justifyContent: 'space-between',
							paddingLeft: 20,
							paddingRight: 20,
							paddingBottom: 20
						}}>
							<View style={{ display: 'flex', flexDirection: 'row' }}>
								<TouchableOpacity
									activeOpacity={0.6} onPress={() => {
									this.props.navigation.closeDrawer()
								}} style={{ alignSelf: 'flex-start', padding: 10, paddingLeft: 0 }}>
									<MaterialIcons name={'close'} color={'#fff'} size={25}/>
								</TouchableOpacity>
							</View>
							{
								this.props.user &&
								<View
									style={{
										flexDirection: 'column',
										flex: 1,
										alignSelf: 'center'
									}}
								>
									<TouchableOpacity
										style={{ display: 'flex', flexDirection: 'column', borderRadius: 8, flex: 1 }}
										activeOpacity={0.7}
										onPress={() => {
											this.props.navigation.closeDrawer()
											// this.props.navigation.navigate('MyAccount')
										}}>
										<View style={{ borderRadius: 8, alignSelf: 'center' }}>
											<FastImage style={{ height: 50, width: 50, alignSelf: 'center', marginBottom: 10, borderRadius: 50 }} source={{
												uri:user.photo,
											}}/>

											<Text
												style={{
													fontSize: 18,

													color: '#fff',
													lineHeight: 24
												}}
											>{user && user.email && user.email.split('@')[0]}</Text>
										</View>

											<View
												style={{
													paddingTop: 5,
													flexDirection: 'row'
												}}
											>
												<MaterialIcons name={'settings'} color={'#F1D3D0'} size={12}
																			 style={{ alignSelf: 'center', marginRight: 2 }}/>
												<Text
													style={{
														fontSize: 12,
														alignSelf: 'center',

														color: '#F1D3D0'
													}}
												>Setarile contului</Text>
											</View>
									</TouchableOpacity>
								</View>
							}
						</View>
						<DrawerContentScrollView {...this.props}
																		 style={{
																			 width: '100%',
																			 flex: 1,
																			 padding: 0, margin: 0,
																			 paddingTop: 0
																		 }}
																		 contentContainerStyle={{ paddingTop: 5 }}>
							{
								filteredItems && filteredItems.routes.map(item => <View key={item.key}><CustomDrawerItem {...this.props}

																																																				 label={descriptors[item.key].options.title}
																																																				 focused={descriptors[item.key].navigation.isFocused()}
																																																				 inactiveBackgroundColor={'transparent'}
																																																				 activeBackgroundColor={'transparent'}
																																																				 onPress={() => {
																																																					 navigation.navigate(item.name)
																																																				 }}
																																																				 icon={descriptors[item.key].options.drawerIcon}
																																																				 labelStyle={{
																																																					 margin: 0,
																																																					 fontSize: 16,

																																																					 width: '100%',
																																																					 flex: 1
																																																				 }}
																																																				 style={{
																																																					 margin: 0,
																																																					 padding: 0,
																																																					 borderBottomColor: '#EAEDF2',
																																																					 borderBottomWidth: 1,
																																																					 marginHorizontal: 0,
																																																					 marginVertical: 0
																																																				 }}/></View>
								)
							}
						</DrawerContentScrollView>
					</View>
					<View style={{ marginBottom: 10 }}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>

							<TouchableOpacity style={{ alignSelf: 'center', marginBottom: 10 }}
																onPress={() => {
																	navigation.closeDrawer()
																	logout()
																}}>
								<Text>Logout</Text>
							</TouchableOpacity>

						</View>
					</View>
				</SafeAreaView>
			</>
		)
	}
}

const CustomDrawerItem = ({ keyItem, label, focused, inactiveBackgroundColor, activeBackgroundColor, inactiveTintColor, activeTintColor, onPress, icon, labelStyle, style }) => {
	const iconNode = icon ? icon({ size: 50, focused }) : null
	return (
		<TouchableItem onPress={onPress} key={keyItem} style={{ flexDirection: 'row' }}
									 pressColor={'#EAEDF2'}>
			<React.Fragment>

				<View style={{ alignSelf: 'center', marginLeft: 10 }}>
					{iconNode}
				</View>
				<View style={{
					flex: 1,
					justifyContent: 'center',
					alignSelf: 'center',
					paddingTop: 15,
					paddingBottom: 15,
					borderBottomColor: '#EAEDF2',
					borderBottomWidth: 0.2,
					marginLeft: 20
				}}>
					<Text style={[{ ...labelStyle }, {
						color: focused ? activeTintColor : inactiveTintColor,
						fontSize: 16,
						alignSelf: 'center'
					}]}>
						{label}
					</Text>
				</View>
			</React.Fragment>
		</TouchableItem>
	)
}
export const MyStatusBar = ({ backgroundColor, ...props }) => (
	<View style={[styles.statusBar, { backgroundColor }]}>
		<StatusBar translucent backgroundColor={backgroundColor} {...props} />
	</View>
)
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56
const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	statusBar: {
		height: STATUSBAR_HEIGHT
	},
	appBar: {
		backgroundColor: '#79B45D',
		height: APPBAR_HEIGHT
	},
	content: {
		flex: 1,
		backgroundColor: '#33373B'
	}
})
