import React, { lazy, useContext } from 'react'
import { AuthContext } from '../Auth/AuthContext'

import { Switch } from 'react-router-dom'
import { PrivateRoute } from '../Global/PrivateRoute'

export const coursesRoutes = [
  {
    name: 'Upload',
    path: '/upload',
    exact: true,
    component: lazy(() => import('./listing/UploadListing'))
  }

]
export default function UploadRouter () {
  const authContext = useContext(AuthContext)
  const { loggedIn } = authContext.state
  // const loggedIn = true
  return (
    <>
      <Switch>
        {
          coursesRoutes.map((route, index) => (
            <PrivateRoute
              key={index} path={route.path}
              exact={route.exact}
              allowed={!!loggedIn}
              redirectTo='/login'
              component={route.component}
            />
          )
          )
        }
      </Switch>
    </>

  )
}
