import styled from 'styled-components'
import { colorBlack40, colorFail, colorWhite, colorWhite40 } from '../../../styles/abstract/variables'
export const CloseWrapper = styled.div`
    width: 20px
    height: 20px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colorFail};
    ${({disabled})=>disabled && `background: ${colorBlack40};
    cursor: initial;`}
    
`

export const CloseInner = styled.i`
    color:${colorWhite};
    fontSize:15px;
    
`
