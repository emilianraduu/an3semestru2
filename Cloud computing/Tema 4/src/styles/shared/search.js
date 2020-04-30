import styled from 'styled-components'
import {
  colorBlack80,
  colorPrimary,
  colorWhite,
  fontSizeNormal,
  secondaryTypeface,
  spacingX2,
  spacingO1, animationIn,
  timeFast
} from '../abstract/variables'

export const MainSearchWrapper = styled.div`
  width: 100%;
  max-width: 320px;
  position: relative;
`

export const MainSearchInput = styled.input`
  background: transparent;
  padding: ${spacingO1} ${spacingX2};
  width: 100%;
  max-width: 320px;
  border-radius: 100em;
  box-sizing: border-box;
  font-family: ${secondaryTypeface};
  font-size: ${fontSizeNormal};
  line-height: 1.5;
  color: ${colorWhite};
  border: 1px solid ${colorWhite};
  
   &:focus {
     outline: 0;
     border-color: ${colorPrimary};
     background: ${colorWhite};
     color: ${colorBlack80};
     transition: border-color ${timeFast} ${animationIn}, background-color ${timeFast} ${animationIn}, color ${timeFast} ${animationIn};
  }
`

export const MainSearchIcon = styled.div`
   position: absolute;
   font-size: 20px;
   color: ${colorWhite}
   right: ${spacingX2};
   top: ${spacingO1};
   
   ${(props) => {
  if (props.active) {
    return `color: ${colorBlack80}`
  }
}}
`

export const FiltersWebWrapper = styled.div`
   display: flex;
   justify-content: space-between;
   margin-bottom: 15px;
   & > * {
    align-self: center;
   }
   `

export const SecondarySearchOption = styled.div`
  display: flex;
  flex-flow: column;
  margin-right: 15px;
  width: 220px;`

export const HeaderSearch = styled.div`
  height: 76px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`