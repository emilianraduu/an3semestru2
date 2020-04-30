import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { routes } from '../../../config/Router'
import { WhiteLink } from '../../../styles/typography/typography'
import _ from 'lodash'

export function NavbarMob({ location ,filterClearer }) {
  return (
    <>
      {
        routes.map((route, index) => {
          return (
            <WhiteLink mobile key={index} active={_.startsWith(location.pathname, route.path)} onClick={() => filterClearer({path: route.path})}>
              <Link to={route.path}>{route.name}</Link>
            </WhiteLink>
          )
        })
      }
    </>
  )
}

export default withRouter(NavbarMob)