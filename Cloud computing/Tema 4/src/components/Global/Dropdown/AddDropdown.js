import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { AddDropdownWrapper, DropdownItemsWrapper } from './styles/dropdown'
import { NormalP } from '../../../styles/typography/typography'
import {BAG_ICON, FILE_ICON, MONEY_BILL_ICON, TROPHY_ICON} from '../../../styles/abstract/variables'

export const STAFF_CREATE_LINK = '/courses/create'
export const ROOMS_CREATE_LINK = '/rooms/create'

export const addDropdownOptions = [

  {
    link: STAFF_CREATE_LINK,
    icon: BAG_ICON,
    title: 'Course'
  },
  {
    link: ROOMS_CREATE_LINK,
    icon: FILE_ICON,
    title: 'Room'
  }
]

function AddDropdown({ show, mob, showFunction, location }) {
  return (
    show &&
    <AddDropdownWrapper mob={mob}>
      {
        addDropdownOptions.map((option, index) =>
          <Link to={option.link} key={index}>
            <DropdownItemsWrapper
              active={location.pathname === option.link}
              onClick={() => {
                showFunction(false)
              }}>
              <i className={option.icon}/>
              <NormalP>
                {option.title}
              </NormalP>
            </DropdownItemsWrapper>
          </Link>
        )
      }
    </AddDropdownWrapper>
  )
}

export default withRouter(AddDropdown)