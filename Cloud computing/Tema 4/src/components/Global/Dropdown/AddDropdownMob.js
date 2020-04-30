import React from 'react'
import {
  DropdownClose,
  DropdownItemsWrapper,
  DropdownMobileWrapper,
  MobileDropdownLinks
} from './styles/dropdown'
import { NormalP } from '../../../styles/typography/typography'
import { Link, withRouter } from 'react-router-dom'
import { addDropdownOptions } from './AddDropdown'
import { TIMES_ICON } from '../../../styles/abstract/variables'

function AddDropdownMob({ showFunction, show, location }) {
  return (
    <DropdownMobileWrapper show={show}>
      <MobileDropdownLinks>
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
      </MobileDropdownLinks>
      <DropdownClose>
        <i className={TIMES_ICON} onClick={() => showFunction(false)}/>
      </DropdownClose>
    </DropdownMobileWrapper>
  )
}

export default withRouter(AddDropdownMob)