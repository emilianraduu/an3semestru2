import styled from 'styled-components'
import React from 'react'
import { Slide, toast } from 'react-toastify'
import { css } from 'glamor'
import {
  colorFail,
  colorPrimary,
  colorSecondaryGradient, spacingX4, TIMES_ICON
} from '../../styles/abstract/variables'
import { NormalPBold } from '../../styles/typography/typography'
import { isMobile } from 'react-device-detect'

const Wrapper = styled.div`
  z-index: 99;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding: 0 ${spacingX4};
  position: relative;
  height: 40px;
  &:before{
     content: '';
     height: 100%;
     width: 20px;
     position: absolute;
     left: 0;
     background: ${colorSecondaryGradient};
     ${props => props.error && `background: ${colorFail}`}
     ${props => props.notification && `background: ${colorPrimary};`}
  }
`

const CloseWrapper = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
 
`

export function Toast({ errorMessage, message, error }) {
  return (
    <Wrapper error={error}>
      {
        error
          ? <NormalPBold> {errorMessage}</NormalPBold>
          : <NormalPBold> {message ? message : 'Success'}</NormalPBold>
      }
    </Wrapper>
  )
}

function setToastStyle({ color }) {
  return {
    closeButton:
      <CloseWrapper>
        <i className={TIMES_ICON}/>
      </CloseWrapper>,
    transition: Slide,
    draggable: false,
    bodyClassName: css({
      margin: '0!important',
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      justifyContent: 'center'

    }),
    className: css({
      padding: '0!important',
      display: 'flex',
      borderRadius: !isMobile && '50px  0 0 50px !important',
      minHeight: 'unset!important'
    }),
    progressClassName: css({
      background: `${color}!important`,
      height: `3px!important`
    }),
    style: css({
      marginRight: '0!important'
    }),
    autoClose: 3000
  }
}


export const showSuccess = (message) => toast(<Toast
  message={message}/>, setToastStyle({ color: colorSecondaryGradient }))
//
// export const showNotification = (message) => toast(<Toast notification message={message}/>, {
//   closeButton: false,
//   className: {
//     padding: 0,
//     background: 'transparent',
//     borderRadius: '4px'
//   },
//   progressClassName: css({
//     background: 'transparent'
//   })
// })
