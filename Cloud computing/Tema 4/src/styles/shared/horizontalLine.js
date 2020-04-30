import styled from 'styled-components'
import { colorBlack16, colorWhite12 } from '../abstract/variables'

export const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colorWhite12};
  
`
export const HorizontalLineSubmenu = styled.div`
  position:absolute;
  margin-top:0px;
  background-color: ${colorBlack16};
  height:1px;
  width:100%;
  margin-left:-64px;
  margin-top:34px;
`