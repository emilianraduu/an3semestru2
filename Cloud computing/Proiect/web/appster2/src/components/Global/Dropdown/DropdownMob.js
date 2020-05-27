import React, { useContext } from 'react'
import { DropdownClose, DropdownItemsWrapper, DropdownMobileWrapper, MobileDropdownLinks } from './styles/dropdown'
import { NormalP } from '../../../styles/typography/typography'
import { AuthContext } from '../../Auth/AuthContext'
import { logout } from '../../Auth/AuthActions'
import { Link } from 'react-router-dom'
import { KEY_SKELETON_ICON_ALT, SIGN_OUT_ICON_ALT, TIMES_ICON } from '../../../styles/abstract/variables'

export default function DropdownMob ({ showFunction, show }) {
  const authContext = useContext(AuthContext)
  return (
    <DropdownMobileWrapper show={show}>
      <MobileDropdownLinks>
        <Link to='/account'>
          <DropdownItemsWrapper
            onClick={() => {
              showFunction(false)
            }}
          >
            <i className={KEY_SKELETON_ICON_ALT} />
            <NormalP>
              Account
            </NormalP>
          </DropdownItemsWrapper>
        </Link>
        <DropdownItemsWrapper onClick={() => logout({ authContext})}>
          <i className={SIGN_OUT_ICON_ALT} />
          <NormalP>
            Logout
          </NormalP>
        </DropdownItemsWrapper>
      </MobileDropdownLinks>
      <DropdownClose>
        <i className={TIMES_ICON} onClick={() => showFunction(false)} />
      </DropdownClose>
    </DropdownMobileWrapper>
  )
}
