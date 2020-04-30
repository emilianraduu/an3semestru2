import styled from 'styled-components'
import {
  colorBlack80,
  colorWhite, spacingX4,
  spacingX8,
  spacingX3,
  spacingX2, colorBlack16
} from '../../../../styles/abstract/variables'

export const HeaderWrapper = styled.div`
  position: sticky;
  z-index: 2;
  top:0;
  background: #fff;
`

export const HeaderImage = styled.div`
  z-index: -1;
  background-repeat: no-repeat;
  position: absolute;
  margin: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  &:before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background-color: ${colorBlack80}
  }
  ${({large})=>large && `height: 174px;`}
`

export const HeaderTopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacingX3} ${spacingX8};
  // border-bottom: 1px solid ${colorBlack16};
`

export const HeaderBottomWrapper = styled.div`
  padding: ${spacingX3} ${spacingX8};
  justify-content: space-between;
  display: flex;
`

export const HeaderTopLeft = styled.div`
  margin-left: 10%;
  margin-right: auto;
  align-self: center;
  display: flex;
  & > * {
    margin: 0 ${spacingX2};
  }
`
export const SubHeaderTop = styled.div`
  margin-right: auto;
  align-self: center;
  display: flex;
  & > * {
    margin: 0 ${spacingX4} 0 0;
  }

`
export const HeaderTopRight = styled.div`
  display:flex;
  align-items: center;
  
  & > *:first-child {
    margin-right: ${spacingX4};
  }
`
