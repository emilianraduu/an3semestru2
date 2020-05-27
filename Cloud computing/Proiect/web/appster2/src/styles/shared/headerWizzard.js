import React from 'react'
import styled from 'styled-components'
import { BoxHeader, HeaderWithIcon } from '../../components/Global/Box/styles/box'
import { BigPGreyBold } from '../typography/typography'
const Wrapper = styled.div``

const StepCount = styled.div`
  font-size:12px;
  color:#aeaeae;
  margin-bottom:5px;
  margin-top:10px;
`
const ProgressWrapper = styled.div`
  height:10px;
  width:100%;
  background-color:#dedede;
  border-radius:10px;
`
const Progress = styled.div`
  height:10px;
  width:${props => props.width.toFixed(0)}%;
  background-color:#41bf74;
  border-radius:10px;
`

export const WizzardHeader = ({ steps, currentStep, title, icon }) => {
  return (
    <Wrapper>
      <StepCount>Step {currentStep} of {steps}</StepCount>
      <ProgressWrapper>
        <Progress width={(currentStep / steps) * 100} />
      </ProgressWrapper>
      <BoxHeader>
        <HeaderWithIcon flex>
          <i className={icon} />
          <BigPGreyBold>{title}</BigPGreyBold>
        </HeaderWithIcon>
      </BoxHeader>

    </Wrapper>)
}
