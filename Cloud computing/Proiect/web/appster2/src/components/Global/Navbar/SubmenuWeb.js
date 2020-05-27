import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { BlackLink } from '../../../styles/typography/typography'
import {
  HeaderTopWrapper, SubHeaderTop
} from '../Header/styles/headerWeb'
import { HorizontalLineSubmenu } from '../../../styles/shared/horizontalLine'
function Submenu ({ match, routes, replacements = {} }) {
  const re = new RegExp(Object.keys(replacements).join('|'), 'gi')
  return (
    <>
      <HeaderTopWrapper>
        <SubHeaderTop>
          {
            routes.map((route, index) => {
              const to = route.path.replace(re, function (matched) {
                return replacements[matched]
              })
              return (
                <BlackLink key={index} active={match.path === route.path}>
                  <Link to={to}>{route.name}</Link>
                </BlackLink>

              )
            })
          }
        </SubHeaderTop>
        <HorizontalLineSubmenu />
      </HeaderTopWrapper>

    </>
  )
}

export default withRouter(Submenu)
