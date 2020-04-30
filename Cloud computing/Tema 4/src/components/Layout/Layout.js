import React from 'react'
import { WrapperPage } from '../../styles/shared/wrapper'

export default function Layout (props) {
  const { Content } = props
  return (
    <WrapperPage>
      <Content/>
    </WrapperPage>
)
}
