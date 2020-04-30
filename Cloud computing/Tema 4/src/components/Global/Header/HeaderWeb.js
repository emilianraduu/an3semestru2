import React from 'react'
import { HeaderWrapper, HeaderImage } from './styles/headerWeb'
import { HorizontalLine } from '../../../styles/shared/horizontalLine'
import HeaderTopWeb from './HeaderTopWeb'
import HeaderBottomWeb from './HeaderBottomWeb'
import { routes } from '../../../config/Router'
import { withRouter } from 'react-router-dom'

function Header({ role, location }) {
  let showHeaderBottom = true
  routes.forEach(route => {
    if (route.path === location.pathname) {
      showHeaderBottom = false
    }
  })
  return (
    <HeaderWrapper>
      <HeaderImage/>
      <HeaderTopWeb role={role}/>
      <HorizontalLine/>
      {
        showHeaderBottom && <>
          <HeaderBottomWeb/>
        </>
      }
    </HeaderWrapper>
  )
}

export default withRouter(Header)