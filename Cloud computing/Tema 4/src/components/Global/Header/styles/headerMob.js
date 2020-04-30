import styled from 'styled-components'
import {
  colorBlack,
  colorWhite,
  fontSizeMedium,
  spacingO4, spacingO3,
  spacingO2, spacingX1
} from '../../../../styles/abstract/variables'

export const HeaderWrapper = styled.div`
  background: ${colorBlack};
  position: sticky;
  z-index: 1;
  top:0;
`

export const HeaderTopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacingO4};
  z-index: 10;
`

export const HeaderBottomWrapper = styled(HeaderTopWrapper)`
  padding-top: ${spacingO3};
  padding-bottom: ${spacingX1};
  display: flex;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0px;
    height:0px;
    position: absolute;
    background: transparent; 
}
`

export const HeaderTopRight = styled.div`
  display:flex;
`

export const HTRIcon = styled.div`
  color: ${colorWhite};
  font-size: ${fontSizeMedium};
  align-self: center;
  display:flex;
  flex-flow:column;
  justify-content: center;
  &:nth-child(n+1){
    margin-left: ${spacingO2};
  }
`
