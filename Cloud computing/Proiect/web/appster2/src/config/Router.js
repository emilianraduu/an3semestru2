import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import React, { lazy, Suspense, useContext } from 'react'
import Layout from '../components/Layout/Layout'
import LayoutAuth from '../components/Layout/LayoutAuth'
import { AuthContext } from '../components/Auth/AuthContext'
import { PrivateRoute } from '../components/Global/PrivateRoute'
import { BrowserView } from 'react-device-detect'
import HeaderWeb from '../components/Global/Header/HeaderWeb'

export const routes = [
	{
		name: 'Upload',
		path: '/upload',
		component: lazy(() => import('../components/Upload/UploadRouter'))
	}
]

export const extraRoutes = [
	{
		name: 'Login',
		path: '/login',
		component: lazy(() => import('../components/Auth/LoginView'))
	}
]

export default function Router () {
	const authContext = useContext(AuthContext)
	const { loggedIn } = authContext.state
	// const loggedIn = true
	return (
		<BrowserRouter>
			{
				loggedIn ? (
						<>
							<BrowserView>
								<HeaderWeb/>
								<RouterContent loggedIn={loggedIn}/>
							</BrowserView>
						</>)
					:
					(
						<>
							<BrowserView>
								<RouterContent loggedIn={loggedIn}/>
							</BrowserView>
						</>)
			}

		</BrowserRouter>
	)
}

export function RouterContent ({ loggedIn }) {
	return (
		<Suspense fallback={<div/>}>
			<Switch>
				{
					routes.map((route, index) => (
							<PrivateRoute
								key={index} path={route.path}
								allowed={!!loggedIn}
								redirectTo='/login'
								render={(props) => (
									<Layout {...props} Content={route.component}/>
								)}
							/>
						)
					)
				}
				{
					extraRoutes.map((route, index) => (
						<PrivateRoute
							key={index} path={route.path}
							allowed={!loggedIn}
							redirectTo={'/upload'}
							render={(props) => (
								<LayoutAuth {...props} Content={route.component}/>

							)}
						/>
					))
				}
				<Route path='' render={() => <Redirect to='/login'/>}/>
			</Switch>
		</Suspense>
	)
}
