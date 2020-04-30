import React, { useContext } from 'react'
import { logout } from '../../Auth/AuthActions'
import { AuthContext } from '../../Auth/AuthContext'
import { DropdownItemsWrapper, DropdownWrapper } from './styles/dropdown'
import { Link } from 'react-router-dom'
import { NormalP } from '../../../styles/typography/typography'
import { KEY_SKELETON_ICON_ALT, SIGN_OUT_ICON_ALT } from '../../../styles/abstract/variables'

export default function Dropdown ({ show, mob, setShow }) {
  const authContext = useContext(AuthContext)
  return (
    show &&
      <DropdownWrapper>
        <DropdownItemsWrapper onClick={() => setShow(false)}>
          <Link to='/account'><NormalP><i className={KEY_SKELETON_ICON_ALT} /> My account</NormalP></Link>
        </DropdownItemsWrapper>
        <DropdownItemsWrapper onClick={() => setShow(false)}>
          <NormalP
            pointer onClick={() => {
              logout({ authContext })
            }}
          ><i className={SIGN_OUT_ICON_ALT} /> Logout
          </NormalP>
        </DropdownItemsWrapper>
      </DropdownWrapper>
  )
}
