import React from 'react'
import { CloseWrapper, CloseInner } from './styles'
import { MULTIPLY_ICON } from '../../../styles/abstract/variables'

export const CloseIcon = ({props, disabled}) => (
  <CloseWrapper {...props} disabled={disabled}>
    <CloseInner className={MULTIPLY_ICON}/>
  </CloseWrapper>
)
