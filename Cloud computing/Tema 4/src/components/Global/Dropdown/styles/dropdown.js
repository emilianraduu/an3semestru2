import styled from 'styled-components'
import {
  boxShadow, colorBlack60, colorPrimary,
  colorWhite, fontSizeNormal, fontSizeSmall,
  radiusX0,
  spacingO1,
  spacingX1
} from '../../../../styles/abstract/variables'

export const DropdownWrapper = styled.div`
   position: absolute;
  background: ${colorWhite};
  padding: ${spacingO1};
  top: calc(100% + 20px);
  width: 150px;
  left:-60px;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-self: center;
  border-radius: ${radiusX0};
  color: black;
  flex-direction:column;
  

  
  button {
    border:0px;
     background: ${colorWhite};
  }
  
  &:before {
    content: '';
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid ${colorWhite};
    position: absolute;
    align-self: center;
    margin-left: auto;
    margin-right: auto;
    bottom: 100%;
    margin: auto;
  }

`

export const AddDropdownWrapper = styled.div`
   position: absolute;
  background: ${colorWhite};
  padding: ${spacingO1};
  top: calc(100% + 20px);
  width: fit-content;
  display: flex;
  justify-content: center;
  z-index:20;
  width: 150px;
  align-self: center;
  border-radius: ${radiusX0};
  color: black;
  flex-direction:column;
  &:before {
    content: '';
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid ${colorWhite};
    position: absolute;
    align-self: center;
    margin-left: auto;
    margin-right: auto;
    bottom: 100%;
    margin: auto;
  }
  ${({ mob }) => mob && `
    font-size:${fontSizeNormal};
  `
}
`


export const DropdownItemsWrapper = styled.div`
  display:flex;
  margin: ${spacingX1};
  & i {
    font-size: ${fontSizeSmall};
    align-self:center;
  }
  ${({ active }) => {
  if (active) {
    return `
      & i 
      { 
        color: ${colorPrimary} !important;
        font-weight: bold;
      }
      & p {
        color: ${colorPrimary};
        font-weight: bold;
      }`
  }
}}
`

export const DropdownMobileWrapper = styled.div`
  display: flex;
  max-width: 0px;
  justify-content: space-between;
  overflow: hidden;
  z-index:3;
  transition: 0.5s all ease;
  box-shadow: ${boxShadow};
  background: ${colorWhite};
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px
  position: absolute;
  right: 0;
  ${({ show, small }) => {
  let style = ''
  if (show) {
    style += `max-width: 500px;
    transition: 0.5s all ease;`
  }
  return style
}
}
  
`

export const MobileDropdownLinks = styled.div`
  display: flex;
  & i {
    color: ${colorBlack60};
  }
  & > * {
    display: flex;
    &:nth-child(n+1){
     position: relative;
      &:after{
          position: absolute;
          content: '';
          width: 1px;
          ${({ noBorder }) => noBorder && `width: 0;`}
          height: 50%;
          border-radius: 2px;
          right: 0;
          align-self: center; 
          background: ${colorBlack60};
        }
       
    }
    &:last-child {
      &:after{
        width: 0px;
      }
    }
  }
    
`

export const DropdownClose = styled.div`
  align-self: center;
  & i {
    color: ${colorBlack60};
  }
`