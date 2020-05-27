import React from 'react'
import { ARROW_LEFT_ICON } from '../../styles/abstract/variables'

export default function BackButton({action}){
  return(
    <div onClick={action}><i className={ARROW_LEFT_ICON}/></div>
  )
}