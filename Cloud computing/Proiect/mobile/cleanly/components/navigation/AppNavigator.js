import React, { PureComponent } from 'react'
import AuthStack from './AuthStack'
import { connect } from 'react-redux'
import MainNavigator from '../MainNavigator'
import { getUser } from '../LoginActions'

@connect(state => ({ user: state.login.user }), { getUser })
export default class AppNavigator extends PureComponent {
	componentDidMount () {
		const { cookie, user, resetCookie, getUser } = this.props
		getUser()
	}

	componentDidUpdate (prevProps) {
		const { cookie, user, resetCookie } = this.props
		if (prevProps.user && !user) {
			resetCookie(true)
		}
	}

	render () {
		const { cookie, user } = this.props
		if (user) {
			return <MainNavigator/>
		}
		if (cookie) {
			return <MainNavigator/>
		}
		return (
			<AuthStack/>
		)
	}
}