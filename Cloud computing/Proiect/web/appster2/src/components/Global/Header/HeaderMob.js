import React, { useContext } from 'react'
import { HeaderWrapper, HeaderBottomWrapper } from './styles/headerMob'
import { PageImage } from '../../../styles/shared/background'
import HeaderTopMob from './HeaderTopMob'
import NavbarMob from '../Navbar/NavbarMob'
import { UploadContext } from '../../Upload/UploadContext'
import { TimetableContext } from '../../Timetable/TimetableContext'
import { clearTournamentsFilters, clearTournamentsSort } from '../../Upload/UploadActions'
import { clearStaffsFilters, clearStaffsSort } from '../../Timetable/TimetableActions'

export default function HeaderMob () {
  const tournamentsContext = useContext(UploadContext)
  const staffsContext = useContext(TimetableContext)

  return (
    <HeaderWrapper>
      <PageImage/>
      <HeaderTopMob />
      <HeaderBottomWrapper>
        <NavbarMob />
      </HeaderBottomWrapper>
    </HeaderWrapper>
  )
}