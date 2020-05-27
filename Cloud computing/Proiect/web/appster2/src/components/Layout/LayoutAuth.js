import React from 'react'
import { WrapperPage } from '../../styles/shared/wrapper'

export default function LayoutAuth(props) {
  const { Content } = props
  return (
    <WrapperPage black>
      <Content/>
    </WrapperPage>
  )
}