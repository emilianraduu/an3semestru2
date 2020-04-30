/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useContext, useRef, useEffect } from 'react'
import {
  HeaderTopWrapper,
  HeaderTopRight,
  HTRIcon
} from './styles/headerMob'
import { Avatar } from '../../../styles/shared/avatar'
import { Link } from 'react-router-dom'
import { Logo } from '../../../styles/shared/logo'
import { AuthContext } from '../../Auth/AuthContext'
import AddDropdownMob from '../Dropdown/AddDropdownMob'
import DropdownMob from '../Dropdown/DropdownMob'
import { PLUS_ICON } from '../../../styles/abstract/variables'

export const PageTitle = 'Cleanly'

export default function HeaderTopMob ({ filterClearer }) {
  const [dropdown, setDropdown] = useState('')
  const [addDropdown, setAddDropdown] = useState('')
  const authContext = useContext(AuthContext)
  const { user } = authContext.state
  const ref = useRef()
  onClickOutside(ref, () => setAddDropdown(false))
  onClickOutside(ref, () => setDropdown(false))

  return (
    <HeaderTopWrapper>
      <Logo mob onClick={() => filterClearer('')}>
        <Link to='/'>{PageTitle}</Link>
      </Logo>
      <HeaderTopRight>
        <HTRIcon
          ref={ref}
          onClick={() => {
            setAddDropdown(!addDropdown)
          }}
          onBlur={() => {
            setTimeout(() => {
              setAddDropdown(false)
            }, 1000)
          }}
        >
          <i className={PLUS_ICON} />
          <AddDropdownMob show={addDropdown} showFunction={setAddDropdown} />
        </HTRIcon>
        <HTRIcon>
          <Avatar
            url={user && user.profileImage && user.profileImage.url} onClick={() => {
              setDropdown(!dropdown)
            }}
          />
          <DropdownMob show={dropdown} showFunction={setDropdown} />
        </HTRIcon>

      </HeaderTopRight>
    </HeaderTopWrapper>
  )
}

function onClickOutside (ref, handler) {
  useEffect(
    () => {
      const listener = event => {
        if (!ref.current || ref.current.contains(event.target)) {
          return
        }
        handler(event)
      }
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)

      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    }, [ref, handler]
  )
}
